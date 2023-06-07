import styled from '@emotion/styled';
import Search from '../components/Search';
import HomeList from '../components/home';

const Home = () => {
  return (
    <Container>
      <Title>
        Fast, secure, simple <br></br>
        BNB Greenfield Data MarketPlace
      </Title>

      <Search></Search>
      <HomeList></HomeList>
    </Container>
  );
};

export default Home;

const Container = styled.div``;
const Title = styled.h1`
  margin: 60px 0;

  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 50px;
  line-height: 70px;

  text-align: center;

  color: #ffffff;
`;
