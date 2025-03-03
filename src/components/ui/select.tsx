import * as React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className="form-select max-w-[500px] border border-black px-2 py-1 rounded-lg"
    >
      {children}
    </select>
  )
);

Select.displayName = 'Select';

export const SelectItem: React.FC<
  React.OptionHTMLAttributes<HTMLOptionElement>
> = ({ children, ...props }) => (
  <option {...props} className="whitespace-normal">
    {children}
  </option>
);

SelectItem.displayName = 'SelectItem';
