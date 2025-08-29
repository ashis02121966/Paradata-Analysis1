import { surveyData, fsuData, householdData, supervisorPerformance, dsPerformance } from '../src/data/mockData';

function displayMockData() {
  console.log('📊 Mock Data Overview:');
  console.log('='.repeat(50));
  
  console.log('\n🔍 SURVEYS:');
  console.log(`Total: ${surveyData.length} surveys`);
  surveyData.forEach(survey => {
    console.log(`  • ${survey.surveyName}`);
    console.log(`    State: ${survey.state}, District: ${survey.district}`);
    console.log(`    Records: ${survey.totalRecords.toLocaleString()} (${survey.recordsApproved.toLocaleString()} approved)`);
    console.log(`    Efficiency: ${((survey.recordsApproved / survey.totalRecords) * 100).toFixed(1)}%`);
    console.log('');
  });
  
  console.log('\n🏘️ FSUs (First Stage Units):');
  console.log(`Total: ${fsuData.length} FSUs`);
  fsuData.forEach(fsu => {
    console.log(`  • ${fsu.fsuName} (${fsu.fsuCode})`);
    console.log(`    Location: ${fsu.village}, ${fsu.block}, ${fsu.district}, ${fsu.state}`);
    console.log(`    Households: ${fsu.totalHouseholds} (${fsu.householdsApproved} approved)`);
    console.log(`    Quality Score: ${fsu.dataQualityScore}%`);
    console.log(`    Enumerator: ${fsu.enumeratorName}`);
    console.log('');
  });
  
  console.log('\n🏠 HOUSEHOLDS:');
  console.log(`Total: ${householdData.length} households`);
  householdData.forEach(household => {
    console.log(`  • ${household.householdId} - ${household.headOfHousehold}`);
    console.log(`    Status: ${household.currentStatus}`);
    console.log(`    Quality Score: ${household.dataQualityScore}%`);
    console.log(`    Family Size: ${household.householdSize} members`);
    console.log(`    Data Changes: ${household.scrutinyChanges.length} changes made`);
    console.log('');
  });
  
  console.log('\n👥 SUPERVISOR PERFORMANCE:');
  console.log(`Total: ${supervisorPerformance.length} supervisors`);
  supervisorPerformance.forEach(supervisor => {
    console.log(`  • ${supervisor.supervisorName} (${supervisor.state})`);
    console.log(`    Reviewed: ${supervisor.totalReviewed.toLocaleString()} records`);
    console.log(`    Approval Rate: ${((supervisor.totalApproved / supervisor.totalReviewed) * 100).toFixed(1)}%`);
    console.log(`    Quality Score: ${supervisor.qualityScore}%`);
    console.log(`    Avg Review Time: ${supervisor.avgReviewTime} hours`);
    console.log('');
  });
  
  console.log('\n🎓 DS PERFORMANCE:');
  console.log(`Total: ${dsPerformance.length} Data Supervisors`);
  dsPerformance.forEach(ds => {
    console.log(`  • ${ds.dsName} (${ds.state})`);
    console.log(`    Reviewed: ${ds.totalReviewed.toLocaleString()} records`);
    console.log(`    Approval Rate: ${((ds.totalApproved / ds.totalReviewed) * 100).toFixed(1)}%`);
    console.log(`    Quality Score: ${ds.qualityScore}%`);
    console.log(`    Avg Review Time: ${ds.avgReviewTime} hours`);
    console.log('');
  });
  
  // Calculate overall statistics
  const totalRecords = surveyData.reduce((sum, s) => sum + s.totalRecords, 0);
  const totalApproved = surveyData.reduce((sum, s) => sum + s.recordsApproved, 0);
  const overallEfficiency = (totalApproved / totalRecords) * 100;
  
  console.log('\n📈 OVERALL STATISTICS:');
  console.log('='.repeat(30));
  console.log(`Total Records Across All Surveys: ${totalRecords.toLocaleString()}`);
  console.log(`Total Approved Records: ${totalApproved.toLocaleString()}`);
  console.log(`Overall Efficiency: ${overallEfficiency.toFixed(1)}%`);
  console.log(`States Covered: ${Array.from(new Set(surveyData.map(s => s.state))).join(', ')}`);
  console.log(`Survey Types: ${surveyData.length} different surveys`);
  
  console.log('\n✅ All mock data is ready to be displayed in the dashboard!');
  console.log('🚀 Start the development server to see the data visualization.');
}

// Run the display script
displayMockData();