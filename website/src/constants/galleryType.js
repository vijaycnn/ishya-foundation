export const GALLERY_TYPE = {
  All: "all",
  OurTeam: "ourTeam",
  Events: "events",
  CommunityWork: "communityWork",
  FundCampaign: "fundCampaign",
};

export const GALLERY_TYPE_OPTIONS = [
  {
    value: GALLERY_TYPE.All,
    label: "All",
  },
  {
    value: GALLERY_TYPE.Events,
    label: "Events",
  },
  {
    value: GALLERY_TYPE.OurTeam,
    label: "Our Team",
  },
  {
    value: GALLERY_TYPE.CommunityWork,
    label: "Community Work",
  },
  {
    value: GALLERY_TYPE.FundCampaign,
    label: "Fundraising Campaigns",
  },
];
export const getGalleryTypeLabel = (value) => {
  return (GALLERY_TYPE_OPTIONS.find((item) => item.value === value)?.label || value);
};
