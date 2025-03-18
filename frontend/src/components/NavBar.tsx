import React from "react";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoHomeOutline, IoLogOutOutline } from "react-icons/io5";
import { FaRegMoon, FaRegUser, FaSearch } from "react-icons/fa";
import {
  MdGridView,
  MdOutlineEmail,
  MdOutlineNotifications,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/actions/authActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const auth = useSelector((state: RootState) => state.auth);

  const currentUser = auth.user;

  return (
    <Flex
      bg="white"
      px={4}
      py={3}
      align="center"
      justify="space-between"
      position="sticky"
      top="0"
      zIndex={999}
      borderBottom={"1px solid lightgray"}
      boxShadow={useColorModeValue("0px 0px 5px 0px rgba(0,0,0,0.1)", "none")}
    >
      {/* Left Section */}
      <Flex align="center" gap={6}>
        <Link to="/">
          <Heading as="h1" size="md" fontWeight="bold" color="#454087">
            Collage Of Managment
          </Heading>
        </Link>
        <Icon
          as={IoHomeOutline as any}
          w={4}
          h={4}
          color="black"
          cursor="pointer"
          onClick={() => navigate("/")}
        />
        <Icon
          as={FaRegMoon as any}
          w={3.5}
          h={3.5}
          color="black"
          cursor="pointer"
          // onClick={toggleDarkMode}
        />
        <Icon
          as={MdGridView as any}
          w={4}
          h={4}
          color="black"
          cursor="pointer"
        />
        <InputGroup display={{ base: "none", md: "flex" }} width="400px">
          <InputLeftElement pointerEvents="none">
            <Icon w={3} h={4} as={FaSearch as any} color="black" mb={4} />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search for friend, post or video"
            bg="white"
            borderRadius="3px"
            pl="2.5rem"
            size="xs"
            color="black"
            border={useColorModeValue(
              "1px solid #ccc",
              "1px solid rgba(255,255,255,0.1)"
            )}
          />
        </InputGroup>
      </Flex>

      {/* Right Section */}
      <Flex align="center" gap={5}>
        <Icon
          as={FaRegUser as any}
          w={4}
          h={4}
          cursor="pointer"
          onClick={() => navigate("/profile")}
        />

        <Icon as={MdOutlineEmail as any} w={5} h={5} cursor="pointer" />
        <Icon as={MdOutlineNotifications as any} w={5} h={5} cursor="pointer" />
        <Icon
          onClick={handleLogout}
          as={IoLogOutOutline as any}
          w={5}
          h={5}
          cursor="pointer"
        />

        <Flex
          align="center"
          gap={2}
          cursor="pointer"
          onClick={() => navigate("/profile")}
        >
          <Box
            w="30px"
            h="30px"
            borderRadius="50%"
            backgroundImage={`url(${
              currentUser?.profileImage || "/default-avatar.png"
            })`}
            backgroundSize="cover"
            backgroundPosition="center"
            border={"1px solid lightgray"}
          />
          <Text fontSize="sm" fontWeight="medium">
            {currentUser?.username || "User"}
          </Text>
        </Flex>
        {/* <Flex align={"center"} gap={0}>
        <Button bg="white" size="sm" onClick={handleLogout}>
          Logout
        </Button>
        <Icon as={IoLogOutOutline as any} w={4} h={4} cursor="pointer" />
      </Flex> */}
      </Flex>
    </Flex>
  );
};

export default NavBar;
