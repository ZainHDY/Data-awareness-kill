// ============================================================================
// EDIT THIS FILE to swap placeholder posts for real ones. Nothing else in
// feed.html needs to change — it just reads whatever's in POSTS below.
//
// Each post is one object:
//   {
//     topic:  one of "fashion" | "food" | "memes" | "politics" | "news" |
//             "sports" | "tech" | "gaming"   (must match profile.html's
//             interest checkboxes EXACTLY — this is what lets you compare
//             stated interest vs. actual engagement later)
//     author: display name shown on the post
//     text:   the post body
//     image:  OPTIONAL. A URL to a real image. Leave it out (or set to null)
//             and the post shows a "[ image ]" placeholder box instead —
//             useful while you're still collecting real screenshots/media.
//   }
//
// Order in this array = order shown in the feed, top to bottom.
// Keep at least 2-3 posts per topic so per-topic dwell time is meaningful;
// beyond that, add as many as you want — the feed just renders whatever's
// here, there's no hardcoded count.
// ============================================================================

const POSTS = [
  { topic: "fashion", author: "Mira K.", text: "Thrifted this coat for $12 and I'm never buying retail again." },
  { topic: "fashion", author: "Deniz T.", text: "Unpopular opinion: chunky sneakers had their moment, let them rest." },
  { topic: "fashion", author: "Lina S.", text: "Capsule wardrobe update — down to 34 pieces and loving it." },

  { topic: "food", author: "Jonah P.", text: "Made a one-pot lentil stew that took 20 minutes. Recipe in comments." },
  { topic: "food", author: "Priya N.", text: "This is your sign to finally try miso in your pasta sauce." },
  { topic: "food", author: "Farah D.", text: "Farmers market haul today. Tomatoes are unreasonably good right now." },

  { topic: "memes", author: "Aliya R.", text: "Me explaining to my houseplants why I forgot to water them again." },
  { topic: "memes", author: "Ben O.", text: "POV: it's Monday and your calendar already has 6 meetings." },
  { topic: "memes", author: "Theo M.", text: "Nobody: ... My brain at 2am: let's replan the entire kitchen." },

  { topic: "politics", author: "Marco V.", text: "Turnout numbers from the regional vote are in — thread below." },
  { topic: "politics", author: "Nadia B.", text: "New transparency bill clears committee, heads to full vote next week." },

  { topic: "news", author: "Yusra H.", text: "Storm system expected to reach the coast by Thursday evening." },
  { topic: "news", author: "Owen C.", text: "City council approves funding for three new transit lines." },
  { topic: "news", author: "Rania E.", text: "Local university opens applications for its new scholarship program." },

  { topic: "sports", author: "Sam W.", text: "That last-minute equalizer was pure chaos. What a match." },
  { topic: "sports", author: "Leo F.", text: "Preseason rankings are out — same three teams at the top again." },

  { topic: "tech", author: "Tala Q.", text: "Switched my whole workflow to a tiling window manager. No regrets." },
  { topic: "tech", author: "Grace L.", text: "New battery chemistry could mean 2x range for the same pack size." },

  { topic: "gaming", author: "Idris A.", text: "Finally beat the boss I've been stuck on for a week. Worth it." },
  { topic: "gaming", author: "Maya J.", text: "Co-op mode patch notes just dropped — full list in the thread." },
];
