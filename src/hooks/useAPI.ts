import { useState, useEffect } from 'react';
import { 
  surveyAPI, 
  fsuAPI, 
  householdAPI, 
  scrutinyChangeAPI, 
  supervisorPerformanceAPI, 
  dsPerformanceAPI,
  dashboardAPI 
} from '../services/api';

// Generic hook for API operations
export function useAPI<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => setData(null) };
}

// Surveys hooks
export function useSurveys(filters?: {
  state?: string;
  district?: string;
  quarter?: string;
  survey_name?: string;
}) {
  return useAPI(() => surveyAPI.getAll(filters), [filters]);
}

export function useSurvey(id: string) {
  return useAPI(() => surveyAPI.getById(id), [id]);
}

export function useSurveyStats() {
  return useAPI(() => surveyAPI.getStats(), []);
}

// FSUs hooks
export function useFSUs(filters?: {
  survey_id?: string;
  state?: string;
  district?: string;
  quarter?: string;
  fsu_code?: string;
}) {
  return useAPI(() => fsuAPI.getAll(filters), [filters]);
}

export function useFSU(id: string) {
  return useAPI(() => fsuAPI.getById(id), [id]);
}

// Households hooks
export function useHouseholds(filters?: {
  fsu_id?: string;
  state?: string;
  district?: string;
  quarter?: string;
  current_status?: string;
  survey_name?: string;
}) {
  return useAPI(() => householdAPI.getAll(filters), [filters]);
}

export function useHousehold(id: string) {
  return useAPI(() => householdAPI.getById(id), [id]);
}

// Scrutiny Changes hooks
export function useScrutinyChanges(filters?: {
  household_id?: string;
  changed_by?: string;
  severity?: string;
  survey_id?: string;
}) {
  return useAPI(() => scrutinyChangeAPI.getAll(filters), [filters]);
}

export function useScrutinyStats(filters?: { state?: string; quarter?: string }) {
  return useAPI(() => scrutinyChangeAPI.getStats(filters), [filters]);
}

// Performance hooks
export function useSupervisorPerformance(filters?: {
  state?: string;
  district?: string;
}) {
  return useAPI(() => supervisorPerformanceAPI.getAll(filters), [filters]);
}

export function useDSPerformance(filters?: {
  state?: string;
}) {
  return useAPI(() => dsPerformanceAPI.getAll(filters), [filters]);
}

// Dashboard hooks
export function useDashboardMetrics(filters?: {
  state?: string;
  quarter?: string;
  survey_name?: string;
}) {
  return useAPI(() => dashboardAPI.getOverallMetrics(filters), [filters]);
}

// Mutation hooks for CRUD operations
export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(params);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// Specific mutation hooks
export function useCreateSurvey() {
  return useMutation(surveyAPI.create);
}

export function useUpdateSurvey() {
  return useMutation(({ id, updates }: { id: string; updates: any }) => 
    surveyAPI.update(id, updates)
  );
}

export function useDeleteSurvey() {
  return useMutation(surveyAPI.delete);
}

export function useCreateHousehold() {
  return useMutation(householdAPI.create);
}

export function useUpdateHousehold() {
  return useMutation(({ id, updates }: { id: string; updates: any }) => 
    householdAPI.update(id, updates)
  );
}

export function useUpdateHouseholdStatus() {
  return useMutation(({ id, status, comments }: { id: string; status: string; comments?: string }) => 
    householdAPI.updateStatus(id, status, comments)
  );
}

export function useCreateScrutinyChange() {
  return useMutation(scrutinyChangeAPI.create);
}