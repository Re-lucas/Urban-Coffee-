// src/pages/Account.jsx
import React, { useContext, useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Checkbox,
  useToast,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUpload, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Account = () => {
  const toast = useToast();
  const { 
    user, 
    logout, 
    updateProfile, 
    addAddress, 
    updateAddress, 
    removeAddress,
    updatePreferences,
    updateNotifications
  } = useContext(AuthContext);
  
  // State management
  const [editName, setEditName] = useState(user?.name || '');
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');
  const [addressFormData, setAddressFormData] = useState({
    id: null,
    label: '',
    recipient: '',
    phone: '',
    fullAddress: '',
  });
  const [selectedPrefs, setSelectedPrefs] = useState(user?.preferences || []);
  const [notifSettings, setNotifSettings] = useState(
    user?.notifications || { orderStatus: true, marketing: false }
  );
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const allFlavorTags = ['果香', '花香', '浓郁', '坚果风味', '巧克力', '焦糖'];
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setPreviewAvatar(user.avatar || '');
      setSelectedPrefs(user.preferences || []);
      setNotifSettings(user.notifications || { orderStatus: true, marketing: false });
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result;
      setPreviewAvatar(base64Url);
      updateProfile({ avatar: base64Url });
      toast({
        title: '头像更新成功',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBasicInfo = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast({
        title: '昵称不能为空',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    updateProfile({ name: editName });
    toast({
      title: '基本信息已更新',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleAddressFormSubmit = (e) => {
    e.preventDefault();
    const { id, label, recipient, phone, fullAddress } = addressFormData;
    
    if (!label || !recipient || !phone || !fullAddress) {
      toast({
        title: '请完整填写地址信息',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    if (id) {
      updateAddress(addressFormData);
      toast({
        title: '地址更新成功',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      addAddress(addressFormData);
      toast({
        title: '地址添加成功',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
    onClose();
  };

  const handleEditAddress = (addr) => {
    setAddressFormData(addr);
    onOpen();
  };

  const handleDeleteAddress = (addrId) => {
    removeAddress(addrId);
    toast({
      title: '地址已删除',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleFlavorToggle = (tag) => {
    const newPrefs = selectedPrefs.includes(tag)
      ? selectedPrefs.filter((t) => t !== tag)
      : [...selectedPrefs, tag];
    setSelectedPrefs(newPrefs);
    updatePreferences(newPrefs);
  };

  const handleNotifToggle = (type) => {
    const newSettings = { ...notifSettings, [type]: !notifSettings[type] };
    setNotifSettings(newSettings);
    updateNotifications(newSettings);
  };

  if (!user) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="xl">请先登录后查看账户信息</Text>
      </Box>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      maxW="6xl"
      mx="auto"
      p={{ base: 4, md: 6 }}
    >
      <Heading as="h1" size="xl" mb={6} color="brand.600">
        我的账户
      </Heading>

      <Tabs variant="enclosed" isFitted>
        <TabList mb={6}>
          <Tab _selected={{ color: 'white', bg: 'brand.500' }}>基本信息</Tab>
          <Tab _selected={{ color: 'white', bg: 'brand.500' }}>偏好设置</Tab>
          <Tab 
            onClick={logout}
            _hover={{ bg: 'red.100' }}
            _selected={{ color: 'white', bg: 'red.500' }}
          >
            退出登录
          </Tab>
        </TabList>

        <TabPanels>
          {/* 基本信息面板 */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {/* 个人信息表单 */}
              <MotionBox
                as="form"
                onSubmit={handleSaveBasicInfo}
                bg={cardBg}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <VStack spacing={6}>
                  <FormControl>
                    <FormLabel>头像</FormLabel>
                    <VStack spacing={4}>
                      <Avatar 
                        size="xl" 
                        src={previewAvatar} 
                        name={user.name}
                        border="2px solid"
                        borderColor="brand.400"
                      />
                      <Button 
                        as="label"
                        leftIcon={<FiUpload />}
                        variant="outline"
                        colorScheme="brand"
                        cursor="pointer"
                      >
                        上传头像
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAvatarChange}
                          display="none"
                        />
                      </Button>
                    </VStack>
                  </FormControl>

                  <FormControl>
                    <FormLabel>昵称</FormLabel>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="请输入昵称"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>邮箱</FormLabel>
                    <Input value={user.email} isReadOnly />
                  </FormControl>

                  <MotionButton
                    type="submit"
                    colorScheme="brand"
                    width="full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    保存基本信息
                  </MotionButton>
                </VStack>
              </MotionBox>

              {/* 地址管理 */}
              <MotionBox
                bg={cardBg}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <VStack spacing={6} align="stretch">
                  <Heading size="md">收货地址</Heading>
                  
                  {user.addresses?.length > 0 ? (
                    <Stack spacing={4}>
                      {user.addresses.map((addr) => (
                        <Box 
                          key={addr.id}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                          borderColor={borderColor}
                        >
                          <VStack align="stretch" spacing={2}>
                            <HStack justify="space-between">
                              <Text fontWeight="bold">{addr.label}</Text>
                              <HStack spacing={2}>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  leftIcon={<FiEdit2 />}
                                  onClick={() => handleEditAddress(addr)}
                                >
                                  编辑
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  colorScheme="red"
                                  leftIcon={<FiTrash2 />}
                                  onClick={() => handleDeleteAddress(addr.id)}
                                >
                                  删除
                                </Button>
                              </HStack>
                            </HStack>
                            <Text>{addr.recipient}</Text>
                            <Text>{addr.phone}</Text>
                            <Text>{addr.fullAddress}</Text>
                          </VStack>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Text color="gray.500">暂无任何地址，快去新增一个吧！</Text>
                  )}

                  <MotionButton
                    leftIcon={<FiPlus />}
                    colorScheme="brand"
                    variant="outline"
                    onClick={() => {
                      setAddressFormData({
                        id: null,
                        label: '',
                        recipient: '',
                        phone: '',
                        fullAddress: '',
                      });
                      onOpen();
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    新增地址
                  </MotionButton>
                </VStack>
              </MotionBox>
            </SimpleGrid>
          </TabPanel>

          {/* 偏好设置面板 */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {/* 口味偏好 */}
              <MotionBox
                bg={cardBg}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <VStack align="start" spacing={6}>
                  <Heading size="md">口味偏好</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    {allFlavorTags.map((tag) => (
                      <Checkbox
                        key={tag}
                        isChecked={selectedPrefs.includes(tag)}
                        onChange={() => handleFlavorToggle(tag)}
                        colorScheme="brand"
                      >
                        {tag}
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                </VStack>
              </MotionBox>

              {/* 通知设置 */}
              <MotionBox
                bg={cardBg}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <VStack align="start" spacing={6}>
                  <Heading size="md">通知设置</Heading>
                  <VStack align="start" spacing={4}>
                    <Checkbox
                      isChecked={notifSettings.orderStatus}
                      onChange={() => handleNotifToggle('orderStatus')}
                      colorScheme="brand"
                    >
                      订单状态通知
                    </Checkbox>
                    <Checkbox
                      isChecked={notifSettings.marketing}
                      onChange={() => handleNotifToggle('marketing')}
                      colorScheme="brand"
                    >
                      营销消息通知
                    </Checkbox>
                  </VStack>
                </VStack>
              </MotionBox>
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* 地址表单模态框 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ModalHeader>{addressFormData.id ? '编辑地址' : '新增地址'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleAddressFormSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>地址标签</FormLabel>
                  <Input
                    value={addressFormData.label}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    placeholder="如：家、公司"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>收件人</FormLabel>
                  <Input
                    value={addressFormData.recipient}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        recipient: e.target.value,
                      }))
                    }
                    placeholder="姓名"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>联系电话</FormLabel>
                  <Input
                    type="tel"
                    value={addressFormData.phone}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="手机号码"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>详细地址</FormLabel>
                  <Textarea
                    value={addressFormData.fullAddress}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        fullAddress: e.target.value,
                      }))
                    }
                    placeholder="省市区+街道门牌号"
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button 
              colorScheme="brand" 
              onClick={handleAddressFormSubmit}
              as={motion.button}
              whileHover={{ scale: 1.05 }}
            >
              保存地址
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
};

export default Account;