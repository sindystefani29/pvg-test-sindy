"use client"
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export interface OpenImageType {
    alt: string
    image: string
}

interface PropsType {
    image: string,
    author: string,
    title: string | null
    openImage: (val: OpenImageType) => void
}

export default function CardComponent({ image, author, title, openImage }: PropsType) {
    const cardTitle = title || "No title"
    return (
        <Grid item xs={12} md={4}>
            <Card>
                <CardMedia
                    sx={{ height: 300 }}
                    image={image}
                    title={cardTitle}
                    loading="lazy"
                    component="img"
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {author}
                    </Typography>
                    <Typography gutterBottom variant="body1" marginTop={2} component="div">
                        {cardTitle}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={() => openImage({ alt: cardTitle, image })} size="small">Open Image</Button>
                </CardActions>
            </Card>
        </Grid>
    )
}