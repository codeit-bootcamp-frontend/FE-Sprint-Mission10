import styled from "styled-components";
import { FlexRowCentered } from "@/styles/CommonStyles";
import ProfilePlaceholder from "@/public/images/ui/ic_profile.svg";
import { Article } from "@/types/articleTypes";
import { formatDate } from "date-fns";
import { Timestamp } from "@/styles/BoardStyles";

const Container = styled(FlexRowCentered)`
  gap: 8px;
  color: var(--gray-600);
  font-size: 14px;
`;

interface ArticleInfoProps {
  article: Article;
}

const ArticleInfo: React.FC<ArticleInfoProps> = ({ article }) => {
  const dateString = formatDate(article.createdAt, "yyyy. MM. dd");

  return (
    <Container>
      <ProfilePlaceholder width={24} height={24} />
      {article.writer.nickname} <Timestamp>{dateString}</Timestamp>
    </Container>
  );
};

export default ArticleInfo;
