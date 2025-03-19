import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";
import React, { useState } from "react";

const TermsConditionsModal = ({ show, onClose }) => {
  const [showModal, setShowModal] = useState(show);
  return (
    <Center className="h-[300px]">
      {/* <Button onPress={() => setShowModal(true)}>
        <ButtonText>Show Modal</ButtonText>
      </Button> */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          onClose(); // Ensure parent state is updated
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Terms & Conditions
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text size="sm" className="text-typography-500">
              <Text className="font-bold">1. Acceptance of Terms</Text>
              {"\n"}By accessing or using QuickAuct, you agree to be bound by
              these Terms of Service.
              {"\n\n"}
              <Text className="font-bold">2. Eligibility</Text>
              {"\n"}You must be at least 18 years old to participate in
              auctions.
              {"\n\n"}
              <Text className="font-bold">3. Registration</Text>
              {"\n"}To bid, you must register an account and provide accurate
              information.
              {"\n\n"}
              <Text className="font-bold">4. Bidding and Purchases</Text>
              {"\n"}Placing a bid constitutes a binding agreement to purchase if
              you win.
              {"\n\n"}
              <Text className="font-bold">5. Payment</Text>
              {"\n"}Winning bidders must complete payments within the specified
              timeframe.
              {"\n\n"}
              <Text className="font-bold">6. Shipping and Pickup</Text>
              {"\n"}Buyers are responsible for arranging shipping or pickup.
              {"\n\n"}
              <Text className="font-bold">7. Prohibited Conduct</Text>
              {"\n"}- No illegal activity.{"\n"}- No interference with the
              platform.{"\n"}- No impersonation of others.
              {"\n\n"}
              <Text className="font-bold">8. Intellectual Property</Text>
              {"\n"}All content on QuickAuct is protected by intellectual
              property laws.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
                onClose(); // Ensure parent state is updated
              }}
            >
              <ButtonText>Closed</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
};

export default TermsConditionsModal;
