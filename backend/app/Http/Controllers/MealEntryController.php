<?php

namespace App\Http\Controllers;

use App\Models\MealEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MealEntryController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $year = $request->input('year');
        $month = $request->input('month');
        
        $startDate = date('Y-m-01', strtotime("$year-$month-01"));
        $endDate = date('Y-m-t', strtotime("$year-$month-01"));

        $entries = MealEntry::where('user_id', $request->user()->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        return response()->json($entries);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'person' => 'required|in:theo,lucas',
        ]);

        $userId = $request->user()->id;
        $date = $request->date;
        $person = $request->person;

        $entry = MealEntry::where('user_id', $userId)
            ->where('date', $date)
            ->where('person', $person)
            ->first();

        if ($entry) {
            // Toggle status: null -> gamelle -> rie -> null
            $status = $entry->status;
            if ($status === null) {
                $entry->status = 'gamelle';
            } elseif ($status === 'gamelle') {
                $entry->status = 'rie';
            } else {
                $entry->delete();
                return response()->json(null, 204);
            }
            $entry->save();
        } else {
            // Create new entry with status gamelle
            $entry = MealEntry::create([
                'user_id' => $userId,
                'date' => $date,
                'person' => $person,
                'status' => 'gamelle',
            ]);
        }

        return response()->json($entry);
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'dates' => 'required|array',
            'dates.*' => 'date',
            'person' => 'required|in:theo,lucas',
            'status' => 'required|in:gamelle,rie,none',
        ]);

        $userId = $request->user()->id;
        $dates = $request->dates;
        $person = $request->person;
        $status = $request->status;

        $entries = [];

        foreach ($dates as $date) {
            if ($status === 'none') {
                // Supprimer l'entrée si elle existe
                MealEntry::where('user_id', $userId)
                    ->where('date', $date)
                    ->where('person', $person)
                    ->delete();
            } else {
                // Créer ou mettre à jour l'entrée
                $entry = MealEntry::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'date' => $date,
                        'person' => $person,
                    ],
                    [
                        'status' => $status,
                    ]
                );
                $entries[] = $entry;
            }
        }

        return response()->json($entries);
    }

    public function stats(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $year = $request->input('year');
        $month = $request->input('month');
        
        $startDate = date('Y-m-01', strtotime("$year-$month-01"));
        $endDate = date('Y-m-t', strtotime("$year-$month-01"));

        $stats = MealEntry::where('user_id', $request->user()->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->select('person', 'status', DB::raw('count(*) as count'))
            ->groupBy('person', 'status')
            ->get();

        $result = [
            'theo' => [
                'gamelle' => 0,
                'rie' => 0,
                'tickets' => 0,
            ],
            'lucas' => [
                'gamelle' => 0,
                'rie' => 0,
                'tickets' => 0,
            ],
        ];

        foreach ($stats as $stat) {
            $result[$stat->person][$stat->status] = $stat->count;
            if ($stat->status === 'gamelle') {
                $result[$stat->person]['tickets'] = $stat->count;
            }
        }

        return response()->json($result);
    }
}
