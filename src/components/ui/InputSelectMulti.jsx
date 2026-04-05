import React, { useMemo } from "react";
import Select from "react-select";

/**
 * InputSelectMulti
 * Dedicated component for multiple selection using react-select.
 *
 * Props:
 * - label: String (visible label)
 * - name: String (used for error mapping)
 * - data: Array of {value, label}
 * - value: Array of values (e.g. [1, 2])
 * - onChange: Function that receives the new array of values
 * - error: Object containing field errors
 * - placeholder: String
 * - disabled: Boolean
 * - inputCol: Boolean (layout flag)
 */
function InputSelectMulti({
  label,
  name,
  data = [],
  value = [],
  onChange,
  error,
  placeholder = "Pilih...",
  disabled = false,
  inputCol = false,
}) {
  const displayLabel = label || name;

  // Map simple value array back to react-select objects
  const selectedOptions = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return data.filter((opt) => value.includes(opt.value));
  }, [data, value]);

  const handleChange = (selected) => {
    // Clear error for this field when changed
    if (error && error[name]) {
      error[name] = null;
    }

    // selected is an array of objects from react-select
    const newValues = selected ? selected.map((opt) => opt.value) : [];
    if (onChange) {
      onChange(newValues);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-8 md:text-left">
      <div
        className={`${inputCol ? "col-span-3 mb-1" : "md:text-right"} ${
          error && error[name] ? "text-red-500" : "text-[#333]"
        } font-semibold`}
      >
        {displayLabel}
      </div>
      <div className="col-span-2">
        <Select
          isMulti
          options={data}
          value={selectedOptions}
          onChange={handleChange}
          placeholder={placeholder}
          isDisabled={disabled}
          classNamePrefix="react-select"
          className={`${error && error[name] ? "border-red-500" : ""}`}
          menuPortalTarget={document.body}
          // Adding a custom style to handle border error more elegantly if needed
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: error && error[name] ? "#ef4444" : base.borderColor,
              "&:hover": {
                borderColor:
                  error && error[name] ? "#ef4444" : base.borderColor,
              },
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
        <small className="text-red-500 h-1 mt-1 block">
          {error && error[name] ? error[name] : " "}
        </small>
      </div>
    </div>
  );
}

export default InputSelectMulti;
