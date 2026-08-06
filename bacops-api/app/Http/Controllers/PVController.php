<?php
// app/Http/Controllers/PVController.php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePvRequest;
use App\Http\Requests\PreviewPvRequest;
use App\Http\Requests\UploadSignedPvRequest;
use App\Http\Resources\PVResource;
use App\Models\PV;
use App\Services\PVService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PVController extends Controller
{
    public function __construct(private PVService $service)
    {
    }

    public function index(): JsonResponse
    {
        try {
            return response()->json(PVResource::collection($this->service->getAllPVs()), 200);
        } catch (\Exception $e) {
            \Log::error('PV fetch failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to fetch PVs'], 500);
        }
    }

    public function store(CreatePvRequest $request): JsonResponse
    {
        try {
            $pv = $this->service->generateOrReuseUnsignedPv([
                'adminId' => $request->user()->id,
                'contractNum' => $request->input('contractNum'),
                'startDate' => $request->input('startDate'),
                'endDate' => $request->input('endDate'),
                'filterCapacite' => $request->input('filterCapacite'),
                'filterMatiere' => $request->input('filterMatiere'),
            ]);

            return response()->json(new PVResource($pv), 201);
        } catch (\Exception $e) {
            \Log::error('PV creation failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to create PV'], 500);
        }
    }

    public function preview(PreviewPvRequest $request): JsonResponse
    {
        try {
            $bacs = $this->service->previewBacs($request->validated());
            return response()->json($bacs, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to fetch PV preview'], 500);
        }
    }

    public function uploadSigned(UploadSignedPvRequest $request, $id): JsonResponse
    {
        try {
            $pvId = (int) $id;
            $file = $request->file('file');

            $pv = $this->service->uploadSignedPv($pvId, file_get_contents($file->getRealPath()));

            return response()->json(new PVResource($pv), 200);
        } catch (\Exception $e) {
            \Log::error('Signed PV upload failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => 'Internal Server Error', 'message' => 'Failed to upload signed PV'], 500);
        }
    }

    public function signedPdf(PV $pv)
    {
        abort_unless($pv->signed_pdf_url, 404);

        return Storage::disk('local')->response($pv->signed_pdf_url, "{$pv->pv_number}.pdf");
    }
}
