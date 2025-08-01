import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Type aliases for cleaner code
type Survey = Database['public']['Tables']['surveys']['Row'];
type SurveyInsert = Database['public']['Tables']['surveys']['Insert'];
type SurveyUpdate = Database['public']['Tables']['surveys']['Update'];

type FSU = Database['public']['Tables']['fsus']['Row'];
type FSUInsert = Database['public']['Tables']['fsus']['Insert'];
type FSUUpdate = Database['public']['Tables']['fsus']['Update'];

type Household = Database['public']['Tables']['households']['Row'];
type HouseholdInsert = Database['public']['Tables']['households']['Insert'];
type HouseholdUpdate = Database['public']['Tables']['households']['Update'];

type ScrutinyChange = Database['public']['Tables']['scrutiny_changes']['Row'];
type ScrutinyChangeInsert = Database['public']['Tables']['scrutiny_changes']['Insert'];
type ScrutinyChangeUpdate = Database['public']['Tables']['scrutiny_changes']['Update'];

type SupervisorPerformance = Database['public']['Tables']['supervisor_performance']['Row'];
type SupervisorPerformanceInsert = Database['public']['Tables']['supervisor_performance']['Insert'];
type SupervisorPerformanceUpdate = Database['public']['Tables']['supervisor_performance']['Update'];

type DSPerformance = Database['public']['Tables']['ds_performance']['Row'];
type DSPerformanceInsert = Database['public']['Tables']['ds_performance']['Insert'];
type DSPerformanceUpdate = Database['public']['Tables']['ds_performance']['Update'];

// Survey API
export const surveyAPI = {
  // Get all surveys with optional filtering
  async getAll(filters?: {
    state?: string;
    district?: string;
    quarter?: string;
    survey_name?: string;
  }): Promise<Survey[]> {
    let query = supabase.from('surveys').select('*');
    
    if (filters?.state && filters.state !== 'All') {
      query = query.eq('state', filters.state);
    }
    if (filters?.district && filters.district !== 'All') {
      query = query.eq('district', filters.district);
    }
    if (filters?.quarter && filters.quarter !== 'All') {
      query = query.eq('quarter', filters.quarter);
    }
    if (filters?.survey_name && filters.survey_name !== 'All') {
      query = query.eq('survey_name', filters.survey_name);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get survey by ID
  async getById(id: string): Promise<Survey | null> {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new survey
  async create(survey: SurveyInsert): Promise<Survey> {
    const { data, error } = await supabase
      .from('surveys')
      .insert(survey)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update survey
  async update(id: string, updates: SurveyUpdate): Promise<Survey> {
    const { data, error } = await supabase
      .from('surveys')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete survey
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get survey statistics
  async getStats(): Promise<{
    total_surveys: number;
    total_records: number;
    total_approved: number;
    total_rejected: number;
    avg_efficiency: number;
  }> {
    const { data, error } = await supabase
      .from('surveys')
      .select('total_records, records_approved, records_rejected');
    
    if (error) throw error;
    
    const totalSurveys = data.length;
    const totalRecords = data.reduce((sum, survey) => sum + survey.total_records, 0);
    const totalApproved = data.reduce((sum, survey) => sum + survey.records_approved, 0);
    const totalRejected = data.reduce((sum, survey) => sum + survey.records_rejected, 0);
    const avgEfficiency = totalRecords > 0 ? (totalApproved / totalRecords) * 100 : 0;
    
    return {
      total_surveys: totalSurveys,
      total_records: totalRecords,
      total_approved: totalApproved,
      total_rejected: totalRejected,
      avg_efficiency: avgEfficiency
    };
  }
};

// FSU API
export const fsuAPI = {
  // Get all FSUs with optional filtering
  async getAll(filters?: {
    survey_id?: string;
    state?: string;
    district?: string;
    quarter?: string;
    fsu_code?: string;
  }): Promise<FSU[]> {
    let query = supabase.from('fsus').select('*');
    
    if (filters?.survey_id) {
      query = query.eq('survey_id', filters.survey_id);
    }
    if (filters?.state && filters.state !== 'All') {
      query = query.eq('state', filters.state);
    }
    if (filters?.district && filters.district !== 'All') {
      query = query.eq('district', filters.district);
    }
    if (filters?.quarter && filters.quarter !== 'All') {
      query = query.eq('quarter', filters.quarter);
    }
    if (filters?.fsu_code && filters.fsu_code !== 'All') {
      query = query.eq('fsu_code', filters.fsu_code);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get FSU by ID
  async getById(id: string): Promise<FSU | null> {
    const { data, error } = await supabase
      .from('fsus')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new FSU
  async create(fsu: FSUInsert): Promise<FSU> {
    const { data, error } = await supabase
      .from('fsus')
      .insert(fsu)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update FSU
  async update(id: string, updates: FSUUpdate): Promise<FSU> {
    const { data, error } = await supabase
      .from('fsus')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete FSU
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('fsus')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Household API
export const householdAPI = {
  // Get all households with optional filtering
  async getAll(filters?: {
    fsu_id?: string;
    state?: string;
    district?: string;
    quarter?: string;
    current_status?: string;
    survey_name?: string;
  }): Promise<Household[]> {
    let query = supabase.from('households').select('*');
    
    if (filters?.fsu_id) {
      query = query.eq('fsu_id', filters.fsu_id);
    }
    if (filters?.state && filters.state !== 'All') {
      query = query.eq('state', filters.state);
    }
    if (filters?.district && filters.district !== 'All') {
      query = query.eq('district', filters.district);
    }
    if (filters?.quarter && filters.quarter !== 'All') {
      query = query.eq('quarter', filters.quarter);
    }
    if (filters?.current_status && filters.current_status !== 'All') {
      query = query.eq('current_status', filters.current_status);
    }
    if (filters?.survey_name && filters.survey_name !== 'All') {
      query = query.eq('survey_name', filters.survey_name);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get household by ID with scrutiny changes
  async getById(id: string): Promise<Household & { scrutiny_changes: ScrutinyChange[] } | null> {
    const { data: household, error: householdError } = await supabase
      .from('households')
      .select('*')
      .eq('id', id)
      .single();
    
    if (householdError) throw householdError;
    if (!household) return null;
    
    const { data: scrutinyChanges, error: changesError } = await supabase
      .from('scrutiny_changes')
      .select('*')
      .eq('household_id', id)
      .order('change_date', { ascending: false });
    
    if (changesError) throw changesError;
    
    return {
      ...household,
      scrutiny_changes: scrutinyChanges || []
    };
  },

  // Create new household
  async create(household: HouseholdInsert): Promise<Household> {
    const { data, error } = await supabase
      .from('households')
      .insert(household)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update household
  async update(id: string, updates: HouseholdUpdate): Promise<Household> {
    const { data, error } = await supabase
      .from('households')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete household
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('households')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Update household status
  async updateStatus(id: string, status: string, comments?: string): Promise<Household> {
    const updates: HouseholdUpdate = {
      current_status: status,
      updated_at: new Date().toISOString()
    };
    
    if (status === 'Under Supervisor Review') {
      updates.supervisor_review_date = new Date().toISOString();
      if (comments) updates.supervisor_comments = comments;
    } else if (status === 'Under DS Review') {
      updates.ds_review_date = new Date().toISOString();
      if (comments) updates.ds_comments = comments;
    }
    
    return this.update(id, updates);
  }
};

// Scrutiny Changes API
export const scrutinyChangeAPI = {
  // Get all scrutiny changes with optional filtering
  async getAll(filters?: {
    household_id?: string;
    changed_by?: string;
    severity?: string;
    survey_id?: string;
  }): Promise<ScrutinyChange[]> {
    let query = supabase.from('scrutiny_changes').select('*');
    
    if (filters?.household_id) {
      query = query.eq('household_id', filters.household_id);
    }
    if (filters?.changed_by && filters.changed_by !== 'All') {
      query = query.eq('changed_by', filters.changed_by);
    }
    if (filters?.severity && filters.severity !== 'All') {
      query = query.eq('severity', filters.severity);
    }
    if (filters?.survey_id) {
      query = query.eq('survey_id', filters.survey_id);
    }
    
    const { data, error } = await query.order('change_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Create new scrutiny change
  async create(change: ScrutinyChangeInsert): Promise<ScrutinyChange> {
    const { data, error } = await supabase
      .from('scrutiny_changes')
      .insert(change)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update scrutiny change
  async update(id: string, updates: ScrutinyChangeUpdate): Promise<ScrutinyChange> {
    const { data, error } = await supabase
      .from('scrutiny_changes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete scrutiny change
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('scrutiny_changes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get scrutiny statistics
  async getStats(filters?: { state?: string; quarter?: string }): Promise<{
    total_changes: number;
    by_severity: Record<string, number>;
    by_changed_by: Record<string, number>;
    by_change_type: Record<string, number>;
  }> {
    let query = supabase.from('scrutiny_changes').select('severity, changed_by, change_type');
    
    if (filters?.state) {
      // Join with households to filter by state
      query = supabase
        .from('scrutiny_changes')
        .select('severity, changed_by, change_type, households!inner(state)')
        .eq('households.state', filters.state);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const totalChanges = data.length;
    const bySeverity: Record<string, number> = {};
    const byChangedBy: Record<string, number> = {};
    const byChangeType: Record<string, number> = {};
    
    data.forEach(change => {
      bySeverity[change.severity] = (bySeverity[change.severity] || 0) + 1;
      byChangedBy[change.changed_by] = (byChangedBy[change.changed_by] || 0) + 1;
      byChangeType[change.change_type] = (byChangeType[change.change_type] || 0) + 1;
    });
    
    return {
      total_changes: totalChanges,
      by_severity: bySeverity,
      by_changed_by: byChangedBy,
      by_change_type: byChangeType
    };
  }
};

// Supervisor Performance API
export const supervisorPerformanceAPI = {
  // Get all supervisor performance data
  async getAll(filters?: {
    state?: string;
    district?: string;
  }): Promise<SupervisorPerformance[]> {
    let query = supabase.from('supervisor_performance').select('*');
    
    if (filters?.state && filters.state !== 'All') {
      query = query.eq('state', filters.state);
    }
    if (filters?.district && filters.district !== 'All') {
      query = query.eq('district', filters.district);
    }
    
    const { data, error } = await query.order('quality_score', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get supervisor by ID
  async getById(id: string): Promise<SupervisorPerformance | null> {
    const { data, error } = await supabase
      .from('supervisor_performance')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update supervisor performance
  async update(id: string, updates: SupervisorPerformanceUpdate): Promise<SupervisorPerformance> {
    const { data, error } = await supabase
      .from('supervisor_performance')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// DS Performance API
export const dsPerformanceAPI = {
  // Get all DS performance data
  async getAll(filters?: {
    state?: string;
  }): Promise<DSPerformance[]> {
    let query = supabase.from('ds_performance').select('*');
    
    if (filters?.state && filters.state !== 'All') {
      query = query.eq('state', filters.state);
    }
    
    const { data, error } = await query.order('quality_score', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get DS by ID
  async getById(id: string): Promise<DSPerformance | null> {
    const { data, error } = await supabase
      .from('ds_performance')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update DS performance
  async update(id: string, updates: DSPerformanceUpdate): Promise<DSPerformance> {
    const { data, error } = await supabase
      .from('ds_performance')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Dashboard API - Aggregated data for dashboard
export const dashboardAPI = {
  // Get overall dashboard metrics
  async getOverallMetrics(filters?: {
    state?: string;
    quarter?: string;
    survey_name?: string;
  }): Promise<{
    totalRecords: number;
    totalApproved: number;
    totalRejected: number;
    totalPending: number;
    overallEfficiency: number;
    avgReviewTime: number;
    qualityScore: number;
    totalFSUs: number;
    totalDataChanges: number;
  }> {
    // Get survey data
    const surveys = await surveyAPI.getAll(filters);
    
    // Get performance data
    const supervisors = await supervisorPerformanceAPI.getAll(filters);
    const dsPerformance = await dsPerformanceAPI.getAll(filters);
    
    // Get scrutiny changes
    const scrutinyChanges = await scrutinyChangeAPI.getAll();
    
    // Calculate metrics
    const totalRecords = surveys.reduce((sum, s) => sum + s.total_records, 0);
    const totalApproved = surveys.reduce((sum, s) => sum + s.records_approved, 0);
    const totalRejected = surveys.reduce((sum, s) => sum + s.records_rejected, 0);
    const totalPending = surveys.reduce((sum, s) => 
      sum + s.records_under_supervisor_review + s.records_under_ds_review + s.records_pending_correction, 0);
    
    const overallEfficiency = totalRecords > 0 ? (totalApproved / totalRecords) * 100 : 0;
    
    // Calculate weighted average review time
    const supervisorTotalTime = supervisors.reduce((sum, s) => sum + (s.avg_review_time * s.total_reviewed), 0);
    const supervisorTotalReviews = supervisors.reduce((sum, s) => sum + s.total_reviewed, 0);
    const dsTotalTime = dsPerformance.reduce((sum, d) => sum + (d.avg_review_time * d.total_reviewed), 0);
    const dsTotalReviews = dsPerformance.reduce((sum, d) => sum + d.total_reviewed, 0);
    
    const totalWeightedTime = supervisorTotalTime + dsTotalTime;
    const totalReviews = supervisorTotalReviews + dsTotalReviews;
    const avgReviewTime = totalReviews > 0 ? totalWeightedTime / totalReviews : 0;
    
    // Calculate average quality score
    const allQualityScores = [...supervisors.map(s => s.quality_score), ...dsPerformance.map(d => d.quality_score)];
    const qualityScore = allQualityScores.length > 0 ? 
      allQualityScores.reduce((sum, score) => sum + score, 0) / allQualityScores.length : 0;
    
    const totalFSUs = surveys.reduce((sum, s) => sum + s.fsu_count, 0);
    const totalDataChanges = scrutinyChanges.length;
    
    return {
      totalRecords,
      totalApproved,
      totalRejected,
      totalPending,
      overallEfficiency,
      avgReviewTime,
      qualityScore,
      totalFSUs,
      totalDataChanges
    };
  }
};