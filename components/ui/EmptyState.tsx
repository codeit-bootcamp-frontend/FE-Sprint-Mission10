import styled from "styled-components";
import EmptyStateImage from "@/public/images/ui/empty-comments.svg";

const EmptyStateContainer = styled.div`
  margin: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  white-space: pre-wrap; // 문자열의 line break을 렌더링하기 위해 추가
`;

interface EmptyStateProps {
  text: string;
  imageComponent?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const EmptyState = ({
  text,
  imageComponent: ImageComponent = EmptyStateImage,
}: EmptyStateProps) => {
  return (
    <EmptyStateContainer>
      <ImageComponent />
      <EmptyStateText>{text}</EmptyStateText>
    </EmptyStateContainer>
  );
};

export default EmptyState;
