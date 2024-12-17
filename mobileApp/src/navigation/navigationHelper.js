import * as React from 'react';
import { DrawerActions, StackActions, CommonActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function goToScreen(name, params = {}) {
    navigationRef.current?.navigate(name, params);
}

export function replaceStack(name) {
    navigationRef.current?.dispatch(StackActions.replace(name));
}

export function appStackReset(screenName) {
    navigationRef.current?.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: screenName }]
        })
    );
}

export const backPress = () => {
    navigationRef.current?.goBack();
};

export const openDrawer = () => {
    navigationRef.current?.dispatch(DrawerActions.openDrawer());
};

export const resetStack = (screen) => {
    navigationRef.current?.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: screen }]
        })
    );
};
