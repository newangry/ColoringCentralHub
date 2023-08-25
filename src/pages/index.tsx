import { IconDots, IconSearch } from '@tabler/icons-react';
import {
    Box,
    Text,
    Image,
    Loader
} from '@mantine/core';
import { TextInput } from '@mantine/core';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMediaQuery } from '@mantine/hooks';
import { ImageType } from '@/types/Image';
import { IconDownload } from '@tabler/icons-react';

const Home = () => {

    const [items, setItems] = useState<ImageType[]>([])
    const [search, setSearch] = useState<string>('');
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [hover, setHover] = useState<number>(-1);
    const isMobile = useMediaQuery(`(max-width: 760px)`);

    
    useEffect(() => {
        const fetch = async() => {
            getItems();        
        }
        fetch();
    },[]);


    const getItems = async () => {
        setIsLoad(true);
        const res = await fetch('/api/get_images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ search })
        });
        if (res.status == 200) {
            const data = await res.json();
            setItems(data);
        }
        setIsLoad(false);
    }

    

    return (
        <Box
            p={15}
        >

            <Box
                sx={(theme) => ({
                    width: isMobile ? '90%' : '60%',
                    margin: 'auto',
                })}
                mt={30}
            >
                <TextInput
                    placeholder="Search your images"
                    icon={<IconSearch size={15} />}
                    radius={30}
                    value={search}
                    onChange={(event) => { setSearch(event.currentTarget.value) }}
                    onKeyUp={(event) => { if (event.keyCode == 13) getItems() }}
                />
            </Box>
            <Box
                mt={20}
                sx={(theme) => ({
                    width: isMobile ? '90%' : '70%',
                    margin: 'auto',
                })}
            >
                <Link href={'/generate'}>
                    <Text
                        size='2em'
                        sx={(theme) => ({
                            border: '1px solid #0088ff',
                            padding: 10,
                            fontFamily: 'arial !important',
                            borderRadius: '35px',
                            background: '#004e9847',
                            color: '#0095ff',
                            cursor: 'pointer',
                            textAlign: 'center',
                            '&:hover': {
                                background: '#004e9847'
                            }
                        })}
                    >
                        Generate your own Coloring -- with Text to Image AI Generator
                    </Text>
                </Link>
            </Box>
            <Box
                sx={(theme) => ({
                    width: '100%',
                    margin: 'auto',
                })}
            >
                {
                    isLoad ? <Box
                        mt={20}
                        sx={(theme) => ({
                            textAlign: 'center'
                        })}
                    >
                        <Loader size='md' />
                    </Box> :
                        <ResponsiveMasonry
                            columnsCountBreakPoints={{
                                200: 1,
                                450: 2,
                                600: 3,
                                800: 4,
                                1000: 5,
                                1200: 6,
                                1400: 7,
                                1600: 8,
                                1800: 9,
                                2000: 10,
                            }}
                            style={{ marginTop: '40px' }}
                        >
                            <Masonry gutter='15px'>
                                {
                                    items.map((item: any, key: any) =>
                                        <Box key={key}
                                            sx={(theme) => ({
                                                cursor: 'pointer'
                                            })}
                                            onMouseOver={() => {
                                                setHover(key);
                                            }}
                                            onMouseLeave={() => { setHover(-1) }}
                                        >
                                            <Image src={item.image_url}
                                                alt='img'
                                                radius={10} />
                                            {
                                                key == hover && !isMobile &&
                                                <div className='overlay'>
                                                    {item.prompt}
                                                </div>
                                            }
                                            {
                                                key == hover && !isMobile &&
                                                <div className='overlay-download'>
                                                    <a href={item.image_url}>
                                                        <IconDownload />
                                                    </a>
                                                </div>
                                            }
                                        </Box>
                                    )
                                }
                            </Masonry>
                        </ResponsiveMasonry>
                }
            </Box>
        </Box>
    )
}

export default Home;