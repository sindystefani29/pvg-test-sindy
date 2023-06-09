import { useEffect, useState } from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import styles from '@/route/styles/Home.module.css'

import { DataListType, FetchStatus } from '@/route/hooks/useFetch/types';

import useFetch from '@/route/hooks/useFetch';
import useDebounce from "@/route/hooks/useDebounce";

import Card, { OpenImageType } from '@/route/components/Card';

const MODAL_STYLE = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  maxWidth: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end'
};

interface DataType {
  page: number
  list: DataListType[]
}

export default function Home({ accessKey }: { accessKey: string }) {
  const [data, setData] = useState<DataType>({
    page: 1,
    list: []
  })
  const [inputSearch, setInputSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<OpenImageType>({
    alt: '',
    image: ''
  })

  const debounceKeyword = useDebounce(inputSearch, 1000)

  const handleToggleSnackbar = () => {
    setSnackbarOpen(prev => !prev)
  };

  const [response] = useFetch({
    accessKey,
    variables: {
      query: debounceKeyword || "cat",
      page: data.page
    },
    onError: handleToggleSnackbar
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value)
    setData(prev => ({
      ...prev,
      page: 1
    }))
  }

  const handleToggleModal = () => {
    setModalOpen(prev => !prev)
  };

  const handleImageClick = (val: OpenImageType) => {
    setSelectedImage(val)
    handleToggleModal()
  }

  const handleLoadMore = () => {
    setData(prev => ({
      ...prev,
      page: prev.page + 1
    }))
  }

  useEffect(() => {
    if (response.data.results) {
      setData(prev => ({
        ...prev,
        list: [...prev.list, ...(response.data.results || [])]
      }))
    }
  }, [response.data.results])

  useEffect(() => {
    if (response.status === FetchStatus.Loading && data.page === 1) {
      setData(prev => ({
        ...prev,
        list: []
      }))
    }
  }, [response.status, data.page])

  return (
    <>
      <Box>
        <AppBar position="fixed">
          <Container maxWidth="lg">
            <Typography variant="h1" component="div" paddingTop={1} paddingBottom={1} fontSize={30} fontWeight={800}>
              PVG
            </Typography>
          </Container>
        </AppBar>
      </Box>
      <div className={styles.container}>
        <Container maxWidth="lg">
          <TextField id="outlined-search" label="Search here" type="search" fullWidth onChange={handleInput} />
          <Box>
            <Grid container spacing={2} marginTop={2}>
              {data.list.map(item => (
                <Card
                  key={item.id}
                  author={item.user.name}
                  title={item.alt_description}
                  image={item.urls.regular}
                  openImage={handleImageClick}
                />
              ))}
              {response.status === FetchStatus.Loading && (
                <Grid item xs={12} display="flex">
                  <CircularProgress style={{ margin: "auto" }} />
                </Grid>
              )}
            </Grid>
          </Box>
          {Boolean(response.data.total && (response.data.total > data.list.length)) && (
            <Button
              variant="outlined"
              fullWidth
              style={{ marginTop: 15 }}
              onClick={handleLoadMore}
            >
              Load more
            </Button>
          )}
        </Container>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleToggleModal}
      >
        <Box sx={MODAL_STYLE}>
          <IconButton className={styles.closeButton} onClick={handleToggleModal}>x</IconButton>
          <img
            src={selectedImage.image}
            className={styles.imageModal}
            alt={selectedImage.alt}
          />
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleToggleSnackbar}
        message="Something went wrong"
      />
    </>
  )
}

export function getStaticProps() {
  return {
    props: {
      accessKey: process.env.UNSPLASH_TOKEN,
    },
  };
}