import { createDomain } from "effector";

interface IAuth {
  loading: boolean;
  ready: boolean;
}

const authDomain = createDomain("auth");

const passLoading = authDomain.createEvent();

export const $auth = authDomain
  .createStore<IAuth>({
    loading: true,
    ready: false,
  })
  .on(passLoading, () => {
    return { ready: false, loading: false };
  });

export const signInFx = authDomain.createEffect(async () => {
  console.log("run signin");
});

$auth.watch((state) => {
  console.log(state);
  if (state.loading) {
    passLoading();
  }
});
