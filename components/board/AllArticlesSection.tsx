import styled from "styled-components";
import {
  LineDivider,
  SectionHeader,
  SectionTitle,
  StyledLink,
} from "@/styles/CommonStyles";
import { Article, ArticleSortOption } from "@/types/articleTypes";
import {
  ArticleInfoWrapper,
  ArticleThumbnail,
  ArticleTitle,
  ImageWrapper,
  MainContent,
} from "@/styles/BoardStyles";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { useEffect, useState } from "react";
import LikeCountDisplay from "@/components/ui/LikeCountDisplay";
import EmptyState from "@/components/ui/EmptyState";
import { useRouter } from "next/router";
import ArticleInfo from "@/components/board/ArticleInfo";

const ItemContainer = styled(Link)``;

interface ArticleItemProps {
  article: Article;
}

const ArticleItem: React.FC<ArticleItemProps> = ({ article }) => {
  return (
    <>
      <ItemContainer href={`/board/${article.id}`}>
        <MainContent>
          <ArticleTitle>{article.title}</ArticleTitle>
          {article.image && (
            <ArticleThumbnail>
              {/* Next Image의 width, height을 설정해줄 것이 아니라면 부모 div 내에서 fill, objectFit 설정으로 비율 유지하면서 유연하게 크기 조정 */}
              {/* 프로젝트 내에 있는 이미지 파일을 사용하는 게 아니라면 next.config.mjs에 이미지 주소 설정 필요 */}
              <ImageWrapper>
                <Image
                  fill
                  src={article.image}
                  alt={`${article.id}번 게시글 이미지`}
                  style={{ objectFit: "contain" }}
                />
              </ImageWrapper>
            </ArticleThumbnail>
          )}
        </MainContent>

        <ArticleInfoWrapper>
          <ArticleInfo article={article} />

          <LikeCountDisplay count={article.likeCount} iconWidth={24} gap={8} />
        </ArticleInfoWrapper>
      </ItemContainer>

      <LineDivider $margin="24px 0" />
    </>
  );
};

const AddArticleLink = styled(StyledLink)``;

interface AllArticlesSectionProps {
  initialArticles: Article[];
}

const AllArticlesSection: React.FC<AllArticlesSectionProps> = ({
  initialArticles,
}) => {
  const [orderBy, setOrderBy] = useState<ArticleSortOption>("recent");
  const [articles, setArticles] = useState(initialArticles);

  const router = useRouter();
  const keyword = (router.query.q as string) || "";

  const handleSortSelection = (sortOption: ArticleSortOption) => {
    setOrderBy(sortOption);
  };

  const handleSearch = (searchKeyword: string) => {
    const query = { ...router.query };
    if (searchKeyword.trim()) {
      query.q = searchKeyword;
    } else {
      delete query.q; // Optional: 키워드가 빈 문자열일 때 URL에서 query string 없애주기
    }
    router.replace({
      pathname: router.pathname,
      query,
    });
  };

  useEffect(() => {
    const fetchArticles = async () => {
      let url = `https://panda-market-api.vercel.app/articles?orderBy=${orderBy}`;
      if (keyword.trim()) {
        // encodeURIComponent는 공백이나 특수 문자 등 URL에 포함될 수 없는 문자열을 안전하게 전달할 수 있도록 인코딩하는 자바스크립트 함수예요.
        url += `&keyword=${encodeURIComponent(keyword)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.list);
    };

    fetchArticles();
  }, [orderBy, keyword]);

  return (
    <div>
      <SectionHeader>
        <SectionTitle>게시글</SectionTitle>
        {/* 참고: 임의로 /addArticle 이라는 pathname으로 게시글 작성 페이지를 추가했어요 */}
        <AddArticleLink href="/addArticle">글쓰기</AddArticleLink>
      </SectionHeader>

      <SectionHeader>
        <SearchBar onSearch={handleSearch} />
        <DropdownMenu
          onSortSelection={handleSortSelection}
          sortOptions={[
            { key: "recent", label: "최신순" },
            { key: "like", label: "인기순" },
          ]}
        />
      </SectionHeader>

      {articles.length
        ? articles.map((article) => (
            <ArticleItem key={`article-${article.id}`} article={article} />
          ))
        : // 참고: 요구사항에는 없었지만 항상 Empty State UI 구현하는 걸 잊지 마세요! Empty State을 재사용 가능한 컴포넌트로 만들었어요.
          // 키워드가 입력되지 않은 상태에서 검색 시 Empty State이 보이지 않도록 조건 추가
          keyword && (
            <EmptyState text={`'${keyword}'로 검색된 결과가 없어요.`} />
          )}
    </div>
  );
};

export default AllArticlesSection;
