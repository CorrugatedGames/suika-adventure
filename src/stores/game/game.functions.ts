import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { IGame } from '../../interfaces';
import { UpdateFirebaseUID } from './game.actions';

export const defaultGame: () => IGame = () => ({
  version: 0,
  firebaseUID: ''
});

export function setFirebaseUID(ctx: StateContext<IGame>, { uid }: UpdateFirebaseUID) {
  ctx.setState(patch<IGame>({
    firebaseUID: uid
  }));
}
