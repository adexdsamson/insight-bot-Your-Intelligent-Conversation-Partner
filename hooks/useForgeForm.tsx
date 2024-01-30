import {
  ComponentType,
  ReactNode,
  isValidElement,
  ReactElement,
  cloneElement,
  Children,
} from "react";
import {
  FieldValue,
  FieldValues,
  FormProvider,
  Resolver,
  UseFormHandleSubmit,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import { View } from "react-native";
import tw from "../lib/tailwind";

type ForgeFormProps = {
  defaultValues?: any;
  resolver?: Resolver<any>;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
};

type UseForgeFormResult<T extends FieldValues> = UseFormReturn<T> & {
  ForgeForm: ComponentType<FormProps<T>>;
};

type FormProps<TFieldValues extends FieldValues> = {
  onSubmit: (submit: TFieldValues) => void;
  classNames?: string;
  children?: ReactNode;
  onError?: (error: TFieldValues) => void;
};

/**
 * A custom hook that returns a form component and form control functions using the `react-hook-form` library.
 * @param {ForgeFormProps} options - The options for the form.
 * @returns {UseForgeFormResult} - The form control functions and the form component.
 */
export const useForgeForm =<TFieldValues extends FieldValues = FieldValues> ({
  defaultValues,
  mode,
  resolver,
}: ForgeFormProps): UseForgeFormResult<TFieldValues> => {
  const formProps = useForm<TFieldValues>({ defaultValues, resolver, mode });
  // const formProps = useForm<T>({ defaultValues, resolver });

  /**
   * The form component that wraps the form content and provides the form control functions and properties.
   * @param {FormProps} props - The props for the form component.
   * @returns {JSX.Element} - The rendered form component.
   */
  const ForgeForm = ({
    classNames,
    children,
    onSubmit,
    onError,
  }: FormProps<TFieldValues>): JSX.Element => {
    const updatedChildren = Children.map(children, (child) => {
      if (isButtonSlot(child)) {
        return cloneElement(child, {
          onPress: formProps.handleSubmit(onSubmit, onError),
        });
      }
      return child;
    });

    return (
      <FormProvider {...formProps}>
        <View style={tw.style(classNames)}>{updatedChildren}</View>
      </FormProvider>
    );
  };

  return { ...formProps, ForgeForm };
};

function isButtonSlot(child: ReactNode): child is ReactElement {
  return isValidElement(child) && child.props.type === "submit";
}
