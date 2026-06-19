const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <p className="sc-error mt-1.5 flex items-center gap-1.5">
      <span className="material-symbols-rounded text-base">error</span>
      {message}
    </p>
  );
};

export default FormError;