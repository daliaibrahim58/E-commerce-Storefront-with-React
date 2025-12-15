import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { FaCheck, FaChevronDown } from "react-icons/fa";


const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const SortSelect = ({ sortBy, setSortBy }) => {
  const selected = sortOptions.find(opt => opt.value === sortBy);

  return (
    <div className="relative w-48">
      <Listbox
        value={selected}
        onChange={(val) => setSortBy(val.value)}
      >

        {/* MAIN BUTTON */}
        <ListboxButton className="relative w-full bg-gray-100 px-4 py-2 rounded-xl text-left text-gray-800 focus:outline-none">
          {selected.label}

          <FaChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none"
          />
        </ListboxButton>

        {/* OPTIONS LIST */}
        <ListboxOptions className="absolute mt-1 w-full bg-white shadow-lg rounded-xl py-1 z-50">
          {sortOptions.map((item) => (
            <ListboxOption
              key={item.value}
              value={item}
              className="group cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2 data-[selected]:bg-gray-100"
            >
              <FaCheck className="text-green-600 opacity-0 group-data-[selected]:opacity-100" />
              {item.label}
            </ListboxOption>
          ))}
        </ListboxOptions>

      </Listbox>
    </div>
  );
};

export default SortSelect;
