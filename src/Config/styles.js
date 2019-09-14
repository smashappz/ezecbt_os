import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import styled from "styled-components/native";

export const SwitchButton = styled.Text`
  background-color: red;
  border-color: red;
  border-radius: 8px;
  border-width: 1;
  color: white;
  font-size: ${wp(4.4)}px;
  font-weight: bold;
  padding: 2px;
  text-align: center;
`;

export const SwitchLeft = styled.View`
  align-items: flex-start;
  flex: 2;
`;

export const SwitchRight = styled.View`
  align-items: flex-end;
  flex: 1;
`;

export const SwitchText = styled.Text`
  color: ${props => props.theme.color};
  font-weight: bold;
  padding-left: ${wp(2.2)}px;
`;

export const SwitchView = styled.View`
  align-items: center;
  border-bottom-width: 1;
  border-color: ${props => props.theme.borderColor};
  flex-direction: row;
  padding: ${wp(4.8)}px;
`;

export const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
