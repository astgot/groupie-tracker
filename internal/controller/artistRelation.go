package controller

import (
	"encoding/json"
	"net/http"

	model "../model"
)

// GetRelation ..
func GetRelation(url string) (*model.Relation, error) {
	relation := &model.Relation{}
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	err = json.NewDecoder(resp.Body).Decode(&relation)
	if err != nil {
		return nil, err
	}
	return relation, nil
}
