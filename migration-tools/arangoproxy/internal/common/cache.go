package common

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"sync"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
)

var mu sync.Mutex

func (service Service) SaveCachedExampleResponse(exampleRequest Example, exampleResponse ExampleResponse) error {
	hashName := fmt.Sprintf("%s_%s_%s", exampleResponse.Options.Name, exampleResponse.Options.Release, exampleResponse.Options.Version)
	requestHash, err := utils.EncodeToBase64(exampleRequest.Raw)
	responseHash, err := utils.EncodeToBase64(exampleResponse)
	if hashName == "" {
		return errors.New("empty entry")
	}

	mu.Lock()
	defer mu.Unlock()
	newCacheEntry := make(map[string]map[string]string)
	newCacheEntry[hashName] = make(map[string]string)
	newCacheEntry[hashName]["request"] = requestHash
	newCacheEntry[hashName]["response"] = responseHash

	cache, err := utils.ReadFileAsMap(config.Conf.Cache)
	if err != nil {
		Logger.Printf("Error %s\n", err.Error())
		return err
	}

	cache[hashName] = newCacheEntry[hashName]
	cacheJson, _ := json.MarshalIndent(cache, "", "\t")
	err = os.WriteFile(config.Conf.Cache, cacheJson, 0644)

	return err
}
