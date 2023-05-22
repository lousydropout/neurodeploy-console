export const Pagination = (props) => {
  const x = () =>
    props
      .logs()
      .pages.sort()
      .reverse()
      .findIndex((y) => y === props.logs().logs[0].timestamp);

  return (
    <nav class="bg-transparent pb-6 pt-12 flex items-center justify-between mt-auto w-full sm:min-w-[50%] sm:space-x-32">
      <div class="hidden sm:block">
        <p class="text-sm leading-5 text-gray-400">
          Showing results
          <span class="font-medium"> {Math.max(0, 10 * x() + 1)} </span>
          to{" "}
          <span class="font-medium">
            {" "}
            {Math.max(0, 10 * x() + props.logs().logs.length)}{" "}
          </span>
        </p>
      </div>
      <div class="flex-1 flex justify-between mt-auto sm:justify-end">
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-600 bg-transparent text-sm leading-5 font-medium text-white"
          disabled={!props.logs().hasPrevious}
          onClick={() => props.getPrevious()}
          classList={{
            "text-opacity-50 bg-opacity-50 border-opacity-50":
              !props.logs().hasPrevious,
            "font-bold text-violet-500 border-violet-500 hover:text-violet-400 hover:border-violet-400 focus:outline-none focus:shadow-outline-violet active:bg-transparent transition ease-in-out duration-150":
              props.hasPrevious,
          }}
        >
          Previous
        </button>
        <button
          class="ml-3 relative inline-flex items-center px-2 py-2 rounded-md border border-gray-600 bg-transparent text-sm leading-5 font-medium text-white"
          disabled={!props.logs().hasNext}
          onClick={() => props.getNext()}
          classList={{
            "text-opacity-50 bg-opacity-50 border-opacity-50":
              !props.logs().hasNext,
            "font-bold text-violet-500 border-violet-500 hover:text-violet-400 hover:border-violet-400 focus:outline-none focus:shadow-outline-violet active:bg-transparent transition ease-in-out duration-150":
              props.logs().hasNext,
          }}
        >
          Next
        </button>
      </div>
    </nav>
  );
};
