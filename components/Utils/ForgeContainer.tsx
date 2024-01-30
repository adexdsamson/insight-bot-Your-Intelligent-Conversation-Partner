import { Component, memo } from "react";
import { Slot } from "./Slots";
import {
  Controller,
  FieldValues,
  RegisterOptions,
  UseFormReturn,
  useFormContext,
} from "react-hook-form";
import { StyleProp, TextInputProps, TextStyle } from "react-native";
import { isEqual } from "lodash";

type ForgeControllerProps = {
  name: string;
  Component: typeof Component<TextInputProps>;
  methods: UseFormReturn;
  className?: string;
  style?: StyleProp<TextStyle>;
  rules?: Omit<
    RegisterOptions<FieldValues, any>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  transform?: {
    input?: (value: string) => string;
    output?: (val: string) => string;
  };
};

const ForgeController = ({
  methods,
  transform,
  rules,
  style,
  Component,
  ...rest
}: ForgeControllerProps) => {
  const getTextTransform = (text: string) => {
    return typeof transform === "undefined" ? text : transform.output(text);
  };

  const getTransformedValue = (text: string) => {
    return typeof transform === "undefined" ? text : transform.input(text);
  };

  return (
    <Controller
      control={methods.control}
      name={rest?.name}
      rules={rules}
      render={({ field: { onBlur, onChange, value } }) => {
        return (
          <Component
            {...rest}
            style={style}
            onBlur={onBlur}
            value={getTransformedValue(value)}
            onChangeText={(value) => onChange(getTextTransform(value))}
          />
        );
      }}
    />
  );
};

const MemorizeController = memo<ForgeControllerProps>(
  (props) => <ForgeController {...props} />,
  (prev, next) => {
    const { methods, ...others } = next;
    const { methods: _, ...rest } = prev;

    if (_.formState.isDirty === methods.formState.isDirty) {
      return true;
    }

    if (isEqual(rest, others)) {
      return true;
    }

    return true
  }
);

type ForgeContainerProps = Record<string, any> & {
  name: string;
  component: any;
  label?: string;
};

export const ForgeContainer = (props: ForgeContainerProps) => {
  const methods = useFormContext();

  return (
    <Slot>
      <MemorizeController
        {...props}
        name={props.name}
        methods={methods}
        Component={props.component}
      />
    </Slot>
  );
};
