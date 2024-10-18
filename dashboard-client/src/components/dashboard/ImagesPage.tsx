//Components
import ImageGrid from "./ImagesPage/ImageGrid";

function ImagesPage() {
  return (
    <div className="w-full h-full flex p-10 justify-start items-start">
      <ImageGrid isNewProperty={false} />
    </div>
  );
}

export default ImagesPage;
