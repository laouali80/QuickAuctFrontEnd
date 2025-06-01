import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";

export const icons = {
  warning: (style: any) => (
    <Entypo name="warning" size={30} color="#f08135" style={style} />
  ),
  success: (style: any) => (
    <AntDesign name="checkcircle" size={30} color="#1f8722" style={style} />
  ),
  error: (style: any) => (
    <MaterialIcons name="error" size={30} color="#d9100a" style={style} />
  ),
  close: (style: any) => (
    <AntDesign name="close" size={25} color="black" style={style} />
  ),
};
