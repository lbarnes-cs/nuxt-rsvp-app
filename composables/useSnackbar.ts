type SnackbarPropsType = {
  color: "success" | "error";
  timeout: number;
  message: string;
  code?: string | null;
};

type SnackbarRequiredProps = { message: string };
type SnackbarOptionalProps = Partial<Omit<SnackbarPropsType, "message">>;
type SnackbarProps = SnackbarRequiredProps & SnackbarOptionalProps;

export function useSnackbar() {
  const snackbarSettings = useState("snackbar", () => ({
    show: false,
    message: "",
    timeout: 8000,
    color: "success",
    code: null as string | null,
  }));

  const displaySnackbar = (props: SnackbarProps) => {
    snackbarSettings.value = {
      ...snackbarSettings.value,
      ...props,
      code: props.code ?? null, // Reset the prop
      show: true,
    };
  };

  return {
    snackbarSettings,
    displaySnackbar,
  };
}
