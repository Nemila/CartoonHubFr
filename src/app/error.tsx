"use client";

const ErrorPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-balance py-4 text-center">
      <div className="max-w-md">
        Désolé, quelque chose a mal tourné. Veuillez réessayer ou contacter le
        développeur.
      </div>
    </div>
  );
};

export default ErrorPage;
