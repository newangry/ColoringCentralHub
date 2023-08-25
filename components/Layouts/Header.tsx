import {
    Flex,
    Text,
    Button,
    Menu,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDots } from '@tabler/icons-react';
import Link from 'next/link';

const Header = () => {
    const isMobile = useMediaQuery(`(max-width: 760px)`);

    return (
        <Flex
            justify='space-between'
            align='center'
            p={15}
        >
            <Link href={'/'}>
                <Text size='20px' weight={900} color='white'>
                    ColoringCentralHub
                </Text>

            </Link>
            <Flex
                justify='flex-start'
                align='center'
                gap={'md'}
            >
                {
                    !isMobile &&
                    <Text size='14px' weight={900} color='white'>
                        LogIn
                    </Text>
                }

                <Button
                    radius={30}
                    sx={(theme) => ({
                        background: 'linear-gradient(94deg,#c764ec,#4a36b1)'
                    })}
                > Sign Up</Button>
                <Menu shadow="md" width={200}>
                    <Menu.Target >
                        <IconDots style={{ cursor: 'pointer' }} />
                    </Menu.Target>
                    <Menu.Dropdown >
                        <Menu.Item>AI Generator</Menu.Item>
                        <Menu.Item>Research</Menu.Item>
                        <Menu.Item>Pricing</Menu.Item>
                        {
                            isMobile &&
                            <Menu.Item>LogIn</Menu.Item>
                        }
                    </Menu.Dropdown>
                </Menu>
            </Flex>
        </Flex>
    )
}
export default Header;