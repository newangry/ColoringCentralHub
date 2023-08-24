import { Box, Grid, TextInput, Image, Button, Text, AspectRatio, Overlay, Loader, Textarea, Popover, Progress, Flex } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useState, useContext } from "react";
import HomeContext from '@/state/index.context';

const Home = () => {

    const isMobile = useMediaQuery(`(max-width: 800px)`);
    const [prompt, setPrompt] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [progressMessage, setProgressMessage] = useState<string>('');
    const {
        state: { colorScheme, lightMode },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    const handleColorScheme = () => {
        homeDispatch({
            field: "colorScheme",
            value: colorScheme == 'dark' ? 'light' : 'dark'
        });
        homeDispatch({
            field: "lightMode",
            value: lightMode == 'dark' ? 'light' : 'dark'
        });
    }

    const generateImage = async () => {``
        setIsLoad(true);
        await getTaskId();
        setIsLoad(false);
    }

    const getTaskId = async () => {
        setProgress(0);
        setProgressMessage('Ready');
        try {
            const res = await fetch('/api/get_taskId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });
            if (res.status == 200) {
                const data = await res.json();
                const task_id = data.taskId;
                await getImages(task_id);
            } else {
                const data = await res.json();
                alert(data);
            }
        } catch (e) {
            alert('Server Error!');
        }
        setProgress(100);
        setProgressMessage('');
    }

    const getImages = async (task_id: string) => {
        const res = await fetch('/api/gen_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task_id })
        });
        if(res.status == 200){
            const data = await res.json();
            if(Object.keys(data).includes('status')){
                const status = data.status;
                if(status == "waiting-to-start") {
                    setProgressMessage('waiting to start');
                    await getImages(task_id);
                } else if(status == 'running') {
                    setProgressMessage(data.percentage+'%');
                    setProgress(Number(data.percentage));
                    await getImages(task_id);
                } else if(status == 'paused'){
                    setProgressMessage('paused');
                    setProgress(Number(data.percentage));
                }
            } else if(Object.keys(data).includes('imageURL')){
                setImage(data.imageURL);
            } else {
                await getImages(task_id);
            }
        }
    }
    const sendImage = async () => {
        if(email == ""){
            alert("Invalide email")
            return;
        }
        try{
            const res = await fetch('/api/send_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image, email })
            })
            if (res.status == 200) {
                alert("Sent generated image successfully")
            } else {
                alert("Server Error");
            }
        }catch(e){
            alert("Server Error!");
        }
    }

    return (
        <Box
            sx={(theme) => ({
                width: isMobile ? '90%' : '60%',
                margin: 'auto',
                paddingTop: '100px'
            })}
        >
            <Text align="center" size='2.5rem' weight={700}>
                Text To Image - AI Image
            </Text>
            <Box sx={(theme) => ({
                textAlign: 'right',
                cursor: 'pointer'
            })}
                onClick={() => { handleColorScheme() }}
            >
                {
                    colorScheme == "dark" ? <IconSun size={20} /> : <IconMoon size={20} />
                }
            </Box>
            <Box
                p={20}
                pt={0}
                mt={20}
                sx={(theme) => ({
                    boxShadow: '0 8px 92px 20px rgb(71 28 115 / 70%)',
                    borderRadius: '10px'
                })}
            >
                {
                    isLoad&&
                    <Box>
                        <Text color="blue" align="center">{progressMessage}</Text>
                        <Progress value={progress} size={'sm'} />
                    </Box>
                }
                
                <Grid gutter='lg' mt={35} pt={40}>
                    <Grid.Col sm={12} md={6} lg={6}>
                        <Textarea
                            value={prompt}
                            placeholder="Enter your prompt"
                            onChange={(event) => { setPrompt(event.currentTarget.value) }}
                        />
                        <Box>
                            <Button radius={20} fullWidth mt={20} onClick={() => { generateImage() }} variant="outline">
                                {
                                    isLoad?<Loader variant="dots"/>:'Generate'
                                }
                            </Button>
                        </Box>
                    </Grid.Col>
                    <Grid.Col sm={12} md={6} lg={6}>
                        <AspectRatio ratio={16 / 16} mx="auto">
                            {
                                image == '' || !image ? <Image src={'/default.png'} alt='' /> : <Image src={image} alt='' />
                            }
                            {
                                isLoad &&
                                <Overlay blur={15} center>
                                    <Loader variant="oval" />
                                </Overlay>
                            }
                        </AspectRatio>

                        <Box pt={20} sx={(theme) => ({
                            textAlign: 'right'
                        })}>
                            <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
                                <Popover.Target>
                                    <Button variant="outline">Download</Button>
                                </Popover.Target>
                                <Popover.Dropdown sx={(theme) => ({ background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}>
                                    <TextInput
                                        label="Email" placeholder="john@doe.com" size="xs" mt="xs"
                                        value={email}
                                        onChange={(event) => { setEmail(event.currentTarget.value) }}
                                    />
                                    <Button mt={10} onClick={() => { sendImage() }}>
                                        Send a image
                                    </Button>
                                </Popover.Dropdown>
                            </Popover>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </Box>
    )
}

export default Home;