// Central asset catalogue. Grouping here keeps screens independent of file names
// and makes a later art replacement a one-line change.
export const backgrounds = {
  splash: require('./backgrounds/splash.png'),
  cafe: require('./backgrounds/cafe-interior.png'),
  cookingHome: require('./backgrounds/cooking-home.png'),
  fishingHome: require('./backgrounds/fishing-home.png'),
  underwaterGame: require('./backgrounds/underwater-game.png'),
  onboarding: require('./backgrounds/onboarding.png'),
  settings: require('./backgrounds/settings-background.png'),
};

export const cooking = {
  counter: require('./cooking/counter.png'),
  character: require('./cooking/customer.png'),
  plate: require('./cooking/empty-plate.png'),
  greens: require('./cooking/greens.png'),
  fish: require('./cooking/raw-fish.png'),
  teapot: require('./cooking/tea-pot.png'),
  teaMug: require('./cooking/tea-mug.png'),
  orangeSauce: require('./cooking/orange-sauce.png'),
  yellowSauce: require('./cooking/yellow-sauce.png'),
  cookedDish: require('./cooking/cooked-dish.png'),
  fishWithGreens: require('./cooking/fish-with-greens.png'),
  lemon: require('./cooking/lemon.png'),
};

export const characters = [
  require('./cooking/customer.png'),
  require('./characters/customer-1.png'),
  require('./characters/customer-2.png'),
  require('./characters/customer-3.png'),
  require('./characters/customer-4.png'),
  require('./characters/customer-5.png'),
  require('./characters/customer-6.png'),
];

export const fishing = {
  gear: [
    require('./fishing/gear-rod.png'),
    require('./fishing/gear-bobber.png'),
    require('./fishing/gear-auger.png'),
  ],
  underwaterFish: [
    require('./fishing/fish-blue-underwater.png'),
    require('./fishing/fish-red-underwater.png'),
    require('./fishing/fish-orange.png'),
    require('./fishing/fish-purple.png'),
    require('./fishing/fish-blue-large.png'),
    require('./fishing/fish-red-large.png'),
    require('./fishing/fish-gold.png'),
  ],
  hook: require('./fishing/hook.png'),
};

export const media = {
  onboardingVideo: require('./media/onboarding.mp4'),
  backgroundMusic: require('./media/background-music.wav'),
};
