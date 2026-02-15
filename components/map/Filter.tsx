import React from "react";

interface FilterProps {
    value: string;
    onSelect: (filterName: string, value: string) => void;
    filterName: string;
    options: string[];
    defaultText: string;
}

export const Filter = ({value, onSelect, filterName, options, defaultText} : FilterProps) => {
  const DEFAULT_OPTION_VALUE = "ALL";
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(filterName, event.target.value);
  }

  return (
    <select
      value={value}
      onChange={onChange}
      className="select-filter">
      <option value={DEFAULT_OPTION_VALUE}>{defaultText}</option>
      {options.map(item => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  )
}