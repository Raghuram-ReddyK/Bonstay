import { useSelector } from "react-redux";
import {
    blueTheme,
    blackTheme,
    greenTheme,
    lightTheme,
    yellowTheme,
} from "../Themes/Theme";

const useTheme = () => {
    const colorScheme = useSelector((state) => state.theme.colorScheme);

    const appliedTheme = (() => {
        switch (colorScheme) {
            case "blue":
                return blueTheme;
            case "red":
                return yellowTheme;
            case "green":
                return greenTheme;
            case "light":
                return lightTheme;
            case "dark":
                return blackTheme;
            default:
                return blackTheme; // Default to blackTheme
        }
    })();

    return appliedTheme;
};

export default useTheme;
