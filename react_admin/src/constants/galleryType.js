
export const GALLERY_TYPE = {
//   IMAGE: "image",
//   VIDEO: "video",
  All: "all",
  OurTeam: "ourTeam",
  Events: "events",
  CommunityWork: "communityWork",
  FundCampaign: "fundCampaign",
};

export const GALLERY_TYPE_OPTIONS = [
//   {
//     value: GALLERY_TYPE.IMAGE,
//     label: "Image",
//   },
//   {
//     value: GALLERY_TYPE.VIDEO,
//     label: "Video",
//   },
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
    // console.log('>>>>>>>>>', value, GALLERY_TYPE_OPTIONS);
  return (GALLERY_TYPE_OPTIONS.find((item) => item.value === value)?.label || value);
};
