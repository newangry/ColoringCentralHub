export interface HomeInitialState {
    colorScheme: 'light' | 'dark';
    lightMode: 'light' | 'dark';
}

export const initialState: HomeInitialState = {
    colorScheme: 'dark',
    lightMode: 'dark'
};
  