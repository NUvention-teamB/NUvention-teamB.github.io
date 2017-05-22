// curl \
// -F "name=LifetimeBudgetSet" \
// -F "lifetime_budget=100000" \
// -F "end_time=1380610800" \
// -F "bid_amount=150" \
// -F "billing_event=APP_INSTALLS" \
// -F "optimization_goal=APP_INSTALLS" \
// -F "promoted_object={'application_id': <APP_ID>, 'object_store_url': <APP_STORE_URL>}" \
// -F "targeting={'geo_locations': {'countries': ['US']}}" \
// -F "campaign_status=ACTIVE" \
// -F "campaign_group_id=<AD_CAMPAIGN_ID>" \
// -F "execution_options=['validate_only']" \
// -F "access_token=<ACCESS_TOKEN>" \
// "https://graph.facebook.com/<API_VERSION>/act_<AD_ACCOUNT_ID>/adcampaigns"

export default async function boostPost(fbLoginToken, postID) {
  console.log(postID);
  var url = 'https://graph.facebook.com/v2.8/act_1/adcampaigns?access_token=' + fbLoginToken;
  url += '&name=' + 'Breezy';
  url += '&promoted_object='+postID;
  var response = await fetch(url);
  var json = await response.json();
  console.log(json);
}
