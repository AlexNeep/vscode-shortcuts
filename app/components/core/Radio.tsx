type RadioProps = { text: string; name: string; defaultChecked?: boolean };

const Radio = ({ text, name, defaultChecked }: RadioProps) => {
  return (
    <div>
      <input
        defaultChecked={defaultChecked}
        className="peer sr-only"
        type="radio"
        value={text}
        name={name}
        id={text}
      />

      <label
        className="flex cursor-pointer rounded-lg border border-gray-400 bg-white p-5 font-semibold shadow-md transition-colors duration-100 hover:bg-blue-100 focus:outline-none peer-checked:border-transparent peer-checked:bg-blue-500 peer-checked:text-white"
        htmlFor={text}
      >
        {text}
      </label>
    </div>
  );
};

export default Radio;
