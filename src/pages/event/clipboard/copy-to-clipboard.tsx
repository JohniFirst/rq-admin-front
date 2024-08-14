import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import styled from "styled-components";

const CopyWrapper = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const CopyButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function CopyToClipboard() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <CopyWrapper>
      <p>
        Click the button below to copy the following text to your clipboard:
      </p>
      <p className="mx-[24px]" style={{ color: "red" }}>
        "This is the text you will copy!"
      </p>
      <CopyButton
        onClick={() => copyToClipboard("This is the text you will copy!")}
      >
        {isCopied ? "Copied!" : "Copy"}
      </CopyButton>
    </CopyWrapper>
  );
}

export default CopyToClipboard;
