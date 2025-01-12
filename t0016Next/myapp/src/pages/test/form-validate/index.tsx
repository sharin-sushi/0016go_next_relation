import { Layout } from "@/components/layout/Layout";
import { TestLink } from "../multi";
import { useState } from "react";

// for template
const pageName = "test/upload";
const pageNum = 0;

const errorMessagesName = "aと入力してください";
export const App = () => {
  const [name, setName] = useState("初期値");
  const { handleInput: handleInputName, isValid: isValidName } = useValidate({
    onInput: setName,
    regularExpression: /a/,
  });

  return (
    <Layout pageName={pageName} isSignin={false}>
      <TestLink thisPageNum={pageNum} />
      <div className="my-2">
        <input
          className="bg-gray-500"
          type="text"
          required
          defaultValue={name}
          onChange={handleInputName}
          // onInput={handleInputName}
        />
      </div>
      <div>現在のname: {name}</div>
      <div>
        エラーメッセージ：
        {isValidName && (
          <span className="text-xs text-red-200">{errorMessagesName}</span>
        )}
      </div>
    </Layout>
  );
};

export default App;

type useValidateType = {
  onInput: (value: string) => void;
  // errorMessages: string[];
  regularExpression: RegExp;
};

const useValidate = ({ onInput, regularExpression }: useValidateType) => {
  const [errorMess, setErrorMessages] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInput(e.target.value);
    if (!regularExpression.test(e.target.value)) {
      setErrorMessages([]);
      setIsValid(true);
    } else {
      setErrorMessages(errorMess);
      setIsValid(false);
    }
  };

  return { isValid, handleInput };
};
