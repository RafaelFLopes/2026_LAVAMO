import React, { useEffect } from "react";
import { Alert as RNAlert } from "react-native";
import { AlertProps } from "./types";

const AlertAndroid: React.FC<AlertProps> = ({ title, message, visible, onClose }) => {
    useEffect(() => {
        if(visible) {
            RNAlert.alert(title, message, [{ text: 'OK', onPress: onClose }]);
        }
    // Só reage ao "visible": o onClose muda a cada render e abriria o alerta nativo de novo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    return null;
};

export default AlertAndroid;