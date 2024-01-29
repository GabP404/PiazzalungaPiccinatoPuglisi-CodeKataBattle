package com.polimi.PPP.CodeKataBattle.Controller;

import com.polimi.PPP.CodeKataBattle.DTOs.ScoreCorrectionDTO;
import com.polimi.PPP.CodeKataBattle.DTOs.SubmissionDTO;
import com.polimi.PPP.CodeKataBattle.Evaluators.EvaluatorProcess;
import com.polimi.PPP.CodeKataBattle.Exceptions.InvalidArgumentException;
import com.polimi.PPP.CodeKataBattle.Exceptions.InvalidTokenException;
import com.polimi.PPP.CodeKataBattle.Security.SubmissionAuthenticationToken;
import com.polimi.PPP.CodeKataBattle.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/battles")
public class BattleController extends AuthenticatedController {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private BattleService battleService;

    @Autowired
    private EvaluatorProcess evaluatorProcess;

    @PostMapping("/{battleId}/commit")
    @PreAuthorize("hasRole(T(com.polimi.PPP.CodeKataBattle.Model.RoleEnum).ROLE_STUDENT)")
    public ResponseEntity<?> registerCommit(@RequestBody String commitHash, @RequestBody String repositoryUrl, @PathVariable Long battleId) {
        SubmissionAuthenticationToken submissionAuth = this.getCommitToken();
        Long bId = submissionAuth.getBattleId();
        Long userId = submissionAuth.getUserId();

        if( !Objects.equals(bId, battleId) )
            throw new InvalidTokenException("Invalid token for the battle.");

        if(repositoryUrl.isEmpty() || commitHash.isEmpty())
            throw new InvalidArgumentException("Invalid arguments for the request.");

        SubmissionDTO submissionDTO = submissionService.createSubmission(bId, userId, repositoryUrl, commitHash);

        evaluatorProcess.processSubmission(submissionDTO);

        return ResponseEntity.ok("Commit registered successfully.");
    }

    @PostMapping("/correctScore")
    public ResponseEntity<?> correctScore(@RequestBody ScoreCorrectionDTO correctionDTO) {
        Optional<String> result = battleService.correctScore(correctionDTO.getSubmissionId(), correctionDTO.getCorrection());
        return ResponseEntity.ok(result);
    }

    private SubmissionAuthenticationToken getCommitToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!(auth instanceof SubmissionAuthenticationToken))
            throw new InvalidTokenException("Invalid Authentication Token");
        return (SubmissionAuthenticationToken) auth;
    }

}
