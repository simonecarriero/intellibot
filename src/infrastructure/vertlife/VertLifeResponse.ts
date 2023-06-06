import * as D from 'io-ts/Decoder';

const Slot = D.struct({
  check_in_at: D.string,
});

const SlotFreeSpots = D.struct({
  slot: Slot,
  free_spots: D.number,
});

export const VertLifeResponse = D.struct({
  slots: D.array(SlotFreeSpots),
});
