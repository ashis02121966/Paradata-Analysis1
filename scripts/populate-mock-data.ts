import { supabase } from '../src/lib/supabase';
import { surveyData, fsuData, householdData, supervisorPerformance, dsPerformance } from '../src/data/mockData';

async function populateMockData() {
  try {
    console.log('Starting to populate mock data...');

    // Clear existing data first
    console.log('Clearing existing data...');
    await supabase.from('scrutiny_changes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('households').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('fsus').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('surveys').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('supervisor_performance').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('ds_performance').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert surveys
    console.log('Inserting surveys...');
    const surveyInserts = surveyData.map(survey => ({
      id: survey.id,
      survey_name: survey.surveyName,
      state: survey.state,
      district: survey.district,
      quarter: survey.quarter,
      total_records: survey.totalRecords,
      records_submitted: survey.recordsSubmitted,
      records_under_supervisor_review: survey.recordsUnderSupervisorReview,
      records_under_ds_review: survey.recordsUnderDSReview,
      records_approved: survey.recordsApproved,
      records_rejected: survey.recordsRejected,
      records_pending_correction: survey.recordsPendingCorrection,
      submission_date: survey.submissionDate,
      last_updated: survey.lastUpdated,
      fsu_count: survey.fsuCount,
      household_count: survey.householdCount
    }));

    const { error: surveyError } = await supabase
      .from('surveys')
      .insert(surveyInserts);

    if (surveyError) {
      console.error('Error inserting surveys:', surveyError);
      throw surveyError;
    }

    // Insert FSUs
    console.log('Inserting FSUs...');
    const fsuInserts = fsuData.map(fsu => ({
      id: fsu.id,
      fsu_code: fsu.fsuCode,
      fsu_name: fsu.fsuName,
      survey_id: fsu.surveyId,
      survey_name: fsu.surveyName,
      state: fsu.state,
      district: fsu.district,
      block: fsu.block,
      village: fsu.village,
      quarter: fsu.quarter,
      enumerator_id: fsu.enumeratorId,
      enumerator_name: fsu.enumeratorName,
      supervisor_id: fsu.supervisorId,
      supervisor_name: fsu.supervisorName,
      ds_id: fsu.dsId,
      ds_name: fsu.dsName,
      total_households: fsu.totalHouseholds,
      households_submitted: fsu.householdsSubmitted,
      households_approved: fsu.householdsApproved,
      households_rejected: fsu.householdsRejected,
      households_pending_correction: fsu.householdsPendingCorrection,
      households_under_supervisor_review: fsu.householdsUnderSupervisorReview,
      households_under_ds_review: fsu.householdsUnderDSReview,
      data_quality_score: fsu.dataQualityScore,
      completeness_score: fsu.completenessScore,
      consistency_score: fsu.consistencyScore,
      submission_date: fsu.submissionDate,
      last_updated: fsu.lastUpdated
    }));

    const { error: fsuError } = await supabase
      .from('fsus')
      .insert(fsuInserts);

    if (fsuError) {
      console.error('Error inserting FSUs:', fsuError);
      throw fsuError;
    }

    // Insert households
    console.log('Inserting households...');
    const householdInserts = householdData.map(household => ({
      id: household.id,
      household_id: household.householdId,
      fsu_id: household.fsuId,
      fsu_code: household.fsuCode,
      survey_name: household.surveyName,
      state: household.state,
      district: household.district,
      quarter: household.quarter,
      head_of_household: household.headOfHousehold,
      household_size: household.householdSize,
      enumerator_id: household.enumeratorId,
      enumerator_name: household.enumeratorName,
      submission_date: household.submissionDate,
      supervisor_review_date: household.supervisorReviewDate || null,
      ds_review_date: household.dsReviewDate || null,
      current_status: household.currentStatus,
      supervisor_comments: household.supervisorComments || null,
      ds_comments: household.dsComments || null,
      data_quality_score: household.dataQualityScore,
      completeness_percentage: household.completenessPercentage,
      critical_errors: household.criticalErrors,
      minor_errors: household.minorErrors,
      scrutiny_iterations: household.scrutinyIterations,
      original_data: household.originalData,
      revised_data: household.revisedData
    }));

    const { error: householdError } = await supabase
      .from('households')
      .insert(householdInserts);

    if (householdError) {
      console.error('Error inserting households:', householdError);
      throw householdError;
    }

    // Insert scrutiny changes
    console.log('Inserting scrutiny changes...');
    const scrutinyChanges = householdData.flatMap(household => 
      household.scrutinyChanges.map(change => ({
        id: change.id,
        household_id: household.id,
        survey_id: change.surveyId,
        schedule: change.schedule,
        block: change.block,
        field_name: change.fieldName,
        field_label: change.fieldLabel,
        original_value: String(change.originalValue),
        revised_value: String(change.revisedValue),
        change_type: change.changeType,
        change_reason: change.changeReason,
        changed_by: change.changedBy,
        change_date: change.changeDate,
        severity: change.severity,
        impact: change.impact
      }))
    );

    if (scrutinyChanges.length > 0) {
      const { error: scrutinyError } = await supabase
        .from('scrutiny_changes')
        .insert(scrutinyChanges);

      if (scrutinyError) {
        console.error('Error inserting scrutiny changes:', scrutinyError);
        throw scrutinyError;
      }
    }

    // Insert supervisor performance
    console.log('Inserting supervisor performance...');
    const supervisorInserts = supervisorPerformance.map(supervisor => ({
      id: supervisor.id,
      supervisor_name: supervisor.supervisorName,
      supervisor_id: supervisor.supervisorId,
      state: supervisor.state,
      district: supervisor.district,
      total_assigned: supervisor.totalAssigned,
      total_reviewed: supervisor.totalReviewed,
      total_approved: supervisor.totalApproved,
      total_rejected: supervisor.totalRejected,
      avg_review_time: supervisor.avgReviewTime,
      quality_score: supervisor.qualityScore,
      pending_reviews: supervisor.pendingReviews,
      last_active: supervisor.lastActive,
      fsus_covered: supervisor.fsusCovered,
      households_reviewed: supervisor.householdsReviewed,
      critical_errors_found: supervisor.criticalErrorsFound,
      data_changes_initiated: supervisor.dataChangesInitiated
    }));

    const { error: supervisorError } = await supabase
      .from('supervisor_performance')
      .insert(supervisorInserts);

    if (supervisorError) {
      console.error('Error inserting supervisor performance:', supervisorError);
      throw supervisorError;
    }

    // Insert DS performance
    console.log('Inserting DS performance...');
    const dsInserts = dsPerformance.map(ds => ({
      id: ds.id,
      ds_name: ds.dsName,
      ds_id: ds.dsId,
      state: ds.state,
      total_assigned: ds.totalAssigned,
      total_reviewed: ds.totalReviewed,
      total_approved: ds.totalApproved,
      total_rejected: ds.totalRejected,
      total_sent_back: ds.totalSentBack,
      avg_review_time: ds.avgReviewTime,
      quality_score: ds.qualityScore,
      pending_reviews: ds.pendingReviews,
      last_active: ds.lastActive,
      fsus_covered: ds.fsusCovered,
      households_reviewed: ds.householdsReviewed,
      critical_errors_found: ds.criticalErrorsFound,
      data_changes_initiated: ds.dataChangesInitiated
    }));

    const { error: dsError } = await supabase
      .from('ds_performance')
      .insert(dsInserts);

    if (dsError) {
      console.error('Error inserting DS performance:', dsError);
      throw dsError;
    }

    console.log('✅ Mock data populated successfully!');
    console.log('📊 Data inserted:');
    console.log(`   - ${surveyData.length} surveys`);
    console.log(`   - ${fsuData.length} FSUs`);
    console.log(`   - ${householdData.length} households`);
    console.log(`   - ${scrutinyChanges.length} scrutiny changes`);
    console.log(`   - ${supervisorPerformance.length} supervisor performance records`);
    console.log(`   - ${dsPerformance.length} DS performance records`);

  } catch (error) {
    console.error('❌ Error populating mock data:', error);
    throw error;
  }
}

// Run the population script
populateMockData()
  .then(() => {
    console.log('🎉 Mock data population completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to populate mock data:', error);
    process.exit(1);
  });