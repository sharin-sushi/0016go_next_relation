package common

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var bcryotCost int
var aesKey []byte
var aesIv []byte
var costString string

func initAesEnv() {
	fmt.Println("start to initAesEnv")
	costString = os.Getenv("BCRYPT_COST")
	aesKey = []byte(os.Getenv("AES_KEY"))
	aesIv, _ = hex.DecodeString(os.Getenv("AES_IV"))
}

func init() {
	var err error
	fmt.Println("start to godotenv.Load")
	if err = godotenv.Load(".env", "../.env"); err != nil {
		fmt.Println("failed to godotenv at init() in cryptgo (on Cloud)")
	}
	initAesEnv()

	bcryotCost, err = strconv.Atoi(costString)
	if err != nil {
		fmt.Printf("failed to convert to bcryptCost. err:%v\n", err)
	}
}

// password

func EncryptPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcryotCost)
	return string(hash), err
}

func CompareHashAndPassword(hash, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

//email

func EncryptByAES(plain string) (encrypted string, err error) {
	bytePlain := []byte(plain)

	block, err := aes.NewCipher(aesKey)
	if err != nil {
		return "", err
	}
	padded := pkcs7Pad(bytePlain)
	byteEncrypted := make([]byte, len(padded))

	cbcEncrypter := cipher.NewCBCEncrypter(block, aesIv)
	cbcEncrypter.CryptBlocks(byteEncrypted, padded)
	convertedHexString := hex.EncodeToString(byteEncrypted)
	encrypted = convertedHexString

	return encrypted, nil
}

func pkcs7Pad(data []byte) []byte {
	length := aes.BlockSize - (len(data) % aes.BlockSize)
	trailing := bytes.Repeat([]byte{byte(length)}, length)
	return append(data, trailing...)
}

func DecryptFromAES(encryptedEmail string) (string, error) {
	byteDecoded, err := hex.DecodeString(encryptedEmail)
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(aesKey)
	if err != nil {
		return "", err
	}
	decrypted := make([]byte, len(byteDecoded))
	cbcDecrypter := cipher.NewCBCDecrypter(block, aesIv)
	cbcDecrypter.CryptBlocks(decrypted, byteDecoded)

	email := string(pkcs7Unpad(decrypted))
	fmt.Println(email)
	return email, nil
}

func pkcs7Unpad(data []byte) []byte {
	dataLength := len(data)
	padLength := int(data[dataLength-1])
	return data[:dataLength-padLength]
}
