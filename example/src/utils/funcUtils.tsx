export function secondsToPlayTimeString(seconds: number | null) {
  if (typeof seconds !== 'number') {
    return '0:00';
  }
  const flooredSeconds = Math.floor(seconds);
  const minutes = Math.floor(flooredSeconds / 60);
  const playTimeSeconds = flooredSeconds % 60 === 0 ? 0 : flooredSeconds - minutes * 60;
  return `${minutes}:${convertShortTimeToLongTime(playTimeSeconds)}`;
}

export function convertShortTimeToLongTime(time: number): string {
  return time < 10 ? `0${time}` : `${time}`;
}

export const debounce = (func: Function, delay: number) => {
  let debounceHandler: NodeJS.Timeout;
  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;
    clearTimeout(debounceHandler);
    debounceHandler = setTimeout(() => func.apply(context, args), delay);
  };
};

export const throttle = (func: Function, limit: number) => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

export function convertArtworkUrlToImageUrl(artworkUrl: string, coverSize: number) {
  return artworkUrl.replace('{w}x{h}', `${coverSize}x${coverSize}`);
}
