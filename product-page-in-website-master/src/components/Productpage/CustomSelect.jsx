import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { FaChevronDown, FaCheck } from "react-icons/fa";

const options = [
  { id: 1, label: "All Prices", value: "all" },
  { id: 2, label: "Under $25", value: "0-25" },
  { id: 3, label: "$25 - $50", value: "25-50" },
  { id: 4, label: "$50 - $100", value: "50-100" },
  { id: 5, label: "Over $100", value: "100" },
];

const CustomSelect = ({ value, onChange }) => {
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          
          {/* BUTTON */}
          <ListboxButton className="relative w-full bg-gray-100 rounded-xl px-4 py-2 text-left text-gray-800 flex items-center justify-between cursor-pointer">
            <span>{selectedOption.label}</span>

            <FaChevronDown className="text-gray-600 size-4" />
          </ListboxButton>

          {/* OPTIONS */}
          <ListboxOptions
            anchor="bottom"
            className="absolute z-50 mt-2 w-[75%] lg:w-52 bg-white rounded-xl shadow-lg py-2"
          >
            {options.map((item) => (
              <ListboxOption
                key={item.id}
                value={item.value}
                className="group cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-3 data-[selected]:bg-gray-100"
              >
                <FaCheck className="size-4 text-green-600 opacity-0 group-data-[selected]:opacity-100" />
                {item.label}
              </ListboxOption>
            ))}
          </ListboxOptions>

        </div>
      </Listbox>
    </div>
  );
};

export default CustomSelect;
