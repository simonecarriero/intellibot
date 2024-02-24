import * as D from 'io-ts/Decoder';

const Slot = D.struct({
  check_in_at: D.string,
});

const SlotFreeSpots = D.struct({
  def_id: D.number,
  slot: Slot,
  free_spots: D.number,
});

export const VertLifeResponse = D.struct({
  slots: D.array(SlotFreeSpots),
});
